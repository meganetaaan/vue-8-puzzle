<template>
  <div class="puzzle-board" tabindex="-1" @keyup.prevent="onKeyUp" @click="onClickBoard">
    <div class="puzzle-message" v-if="isTouchNeeded">Touch to start</div>
    <canvas
      ref="puzzle-canvas"
      class="puzzle-canvas"
      @click.prevent
      @mousedown.prevent
      @mouseup.prevent="onClick"
      @touchend.prevent="onTouchEnd"
      :style="canvasStyle"
      :width="internalWidth * 2"
      :height="internalHeight"
    ></canvas>
    <img v-if="isImage" :style="sourceStyle" :src="src" ref="sourceImg">
    <video
      v-else
      ref="sourceImg"
      autoplay
      loop
      playsinline
      :muted="muted"
      :src="src"
      :style="sourceStyle"
      :width="internalWidth"
      :height="internalHeight"
    >
      <source
        v-for="source of sources"
        v-bind:key="source.src"
        :src="source.src"
        :type="source.type"
      >No video
    </video>
  </div>
</template>

<script>
import Board from '../board.ts'
import Vue from 'vue'
import debounce from 'lodash.debounce'
import TWEEN from 'tween.js'

const createBoard2D = (dx, dy) => {
  const result = []
  let n = 0
  for (let i = 0; i < dy; i++) {
    const sub = []
    for (let j = 0; j < dx; j++) {
      sub.push(++n % (dx * dy))
    }
    result.push(sub)
  }
  return result
}

const createRandomBoard2D = (dx, dy) => {
  const board2D = createBoard2D(dx, dy)
  // TODO: Refactoring
  const board = new Board(board2D)
  const methodNames = ['swapAbove', 'swapLeft', 'swapRight', 'swapBelow']
  const len = methodNames.length
  for (let i = 0; i < 100; i++) {
    const methodName = methodNames[Math.floor(Math.random() * len)]
    try {
      board[methodName](board.blankpos)
    } catch (e) {
      continue
    }
  }
  return board
}

export default {
  name: 'PuzzleBoard',
  data() {
    this._blockPositions = []
    this._isStarted = false
    const board = createRandomBoard2D(this.cols, this.rows)
    return {
      isTouchNeeded: true,
      blocks: board.blocks,
      isGoal: false,
      manhattan: null,
      hamming: null,
      internalWidth: this.width,
      internalHeight: this.height,
      board: board,
      rafId: null
    }
  },
  props: {
    src: {
      type: String
    },
    sources: {
      type: Array
    },
    muted: {
      type: Boolean,
      default: true
    },
    animation: {
      type: Boolean,
      default: true
    },
    cols: {
      type: Number,
      default: 4
    },
    width: {
      type: Number,
      default: 300
    },
    height: {
      type: Number,
      default: 300
    },
    rows: {
      type: Number,
      default: 4
    },
    showNumber: {
      type: Boolean,
      default: true
    },
    autoResize: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    cellWidth() {
      return this.internalWidth / this.cols
    },
    cellHeight() {
      return this.internalHeight / this.rows
    },
    isImage() {
      return /\.(jpe?g|png|webm|gif)$/i.test(this.src)
    },
    canvasStyle() {
      return {
        left: this.isGoal ? '-100%' : 0
      }
    },
    sourceStyle() {
      return {
        // display: 'none'
        visibility: 'hidden'
      }
    }
  },
  beforeDestroy() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId)
    }
  },
  mounted() {
    this.onResize()
    window.addEventListener('resize', debounce(this.onResize.bind(this), 300))
    this._tmpCanvas = document.createElement('canvas')
    this._tmpCtx = this._tmpCanvas.getContext('2d')
    this._lastRenderVideoTime = -1
    this._lastRenderTime = 0
    if (this.isImage) {
      this.$refs.sourceImg.onload = () => {
        this.isTouchNeeded = false
        this._loadImageToCanvas()
      }
    } else {
      this.$refs.sourceImg.addEventListener('play', () => {
        this.isTouchNeeded = false
      })
    }
    const loop = () => {
      TWEEN.update()
      if (this.$refs.sourceImg == null || this.$refs.sourceImg.readyState < 3) {
        requestAnimationFrame(loop)
        return
      }
      const sourceImg = this.$refs.sourceImg
      const canvas = this.$refs['puzzle-canvas']
      const ctx = canvas.getContext('2d')
      const w = this.internalWidth

      // copy from video
      if (sourceImg.currentTime !== this._lastRender) {
        this._lastRenderVideoTime = sourceImg.currentTime

        // TODO: choose trimming strategy
        // trims square area from the center of the source

        this._loadVideoFrameToCanvas()
      }

      if (this.isGoal) {
        requestAnimationFrame(loop)
        return
      }

      // main render
      ctx.clearRect(0, 0, this.internalWidth, this.internalHeight)

      // number
      if (this.showNumber) {
        ctx.font = "24px 'Avenir', Helvetica, Arial, sans-serif"
        ctx.fillStyle = '#fafafa'
        ctx.textBaseline = 'top'
      }

      for (let i = 0, len = this.blocks.length; i < len; i++) {
        const block = this.blocks[i]
        if (block === 0) {
          continue
        }
        const row = this.board.row(block - 1)
        const col = this.board.col(block - 1)
        const sourceX = this.cellWidth * col + w
        const sourceY = this.cellHeight * row
        const pos = this._blockPositions[block]
        if (pos == null) {
          continue
        }
        const targetX = pos.x
        const targetY = pos.y
        ctx.drawImage(
          canvas,
          sourceX,
          sourceY,
          this.cellWidth,
          this.cellHeight,
          targetX,
          targetY,
          this.cellWidth,
          this.cellHeight
        )
        if (this.showNumber) {
          const text = String(block)
          const margin = 5
          ctx.strokeText(text, margin + targetX, margin + targetY)
          ctx.fillText(text, margin + targetX, margin + targetY)
        }
      }
      this.rafId = requestAnimationFrame(loop)
    }
    this.$nextTick(loop)
    this.$emit('init')
  },
  watch: {
    cols() {
      this.initBoard()
    },
    rows() {
      this.initBoard()
    },
    board() {
      this.blocks = this.board.blocks
    },
    width() {
      this.onResize()
    },
    height() {
      this.onResize()
    },
    blocks() {
      const isImmediate = !this.animation
      this.updateBlockPositions(isImmediate)
      this.isGoal = this.board.isGoal()
      this.manhattan = this.board.manhattan()
      this.hamming = this.board.hamming()
      this.$emit('change', {
        blocks: this.blocks,
        isGoal: this.isGoal,
        distance: this.manhattan
      })
    },
    isGoal() {
      if (this.isGoal) {
        this.$emit('finish')
      }
    },
    sources() {
      if (!this.isImage) {
        // load and play video after the video element appears
        this.$nextTick(() => {
          this.$refs.sourceImg.load()
          this.isTouchNeeded = true
          this.$refs.sourceImg.play()
          this.$refs.sourceImg.addEventListener('play', () => {
            this.isTouchNeeded = false
          })
        })
      }
    },
    src() {
      if (this.isImage) {
        this.isTouchNeeded = false
        // add onLoadImage hook after the img element appears
        this.$nextTick(() => {
          this.$refs.sourceImg.addEventListener('load', () => {
            this._loadImageToCanvas()
          })
        })
      }
    }
  },
  methods: {
    initBoard() {
      this.board = createRandomBoard2D(this.cols, this.rows)
      this._blockPositions = []
      this._isStarted = false
      this.$emit('init')
    },
    updateBlockPositions(isImmediate) {
      for (let i = 0, len = this.blocks.length; i < len; i++) {
        const b = this.blocks[i]
        const col = this.board.col(i)
        const row = this.board.row(i)
        const x = this.cellWidth * col
        const y = this.cellHeight * row
        const from = this._blockPositions[b] || { x: 0, y: 0 }
        if (this._blockPositions[b] == null) {
          this._blockPositions[b] = from
        }
        if (from.x - x === 0 && from.y - y === 0) {
          continue
        }
        const obj = { x: from.x, y: from.y }
        if (isImmediate) {
          this._blockPositions[b].x = x
          this._blockPositions[b].y = y
        } else {
          new TWEEN.Tween(obj)
            .to({ x, y }, 200)
            .easing(TWEEN.Easing.Quadratic.Out)
            .onUpdate(() => {
              this._blockPositions[b].x = obj.x
              this._blockPositions[b].y = obj.y
            })
            .start()
        }
      }
    },
    _loadImageToCanvas() {
      // TODO: Refactor
      const sourceImg = this.$refs.sourceImg
      const canvas = this.$refs['puzzle-canvas']
      const ctx = canvas.getContext('2d')
      const w = this.width
      const h = this.height
      const vw = sourceImg.width
      const vh = sourceImg.height
      const ratio = Math.max(w / vw, h / vh)

      // NOTE: iOS11 has a memory leak on canvas.drawImage with 9 args
      // if the image is scaled.
      // to prevent them I have to use 5 args version for scaling
      this._tmpCanvas.width = vw * ratio
      this._tmpCanvas.height = vh * ratio
      this._tmpCtx.drawImage(sourceImg, 0, 0, vw * ratio, vh * ratio)

      // copies clipped video source to canvas for sync drawing
      const marginX = (vw * ratio - w) / 2
      const marginY = (vh * ratio - h) / 2
      ctx.drawImage(this._tmpCanvas, marginX, marginY, w, h, w, 0, w, h)
    },
    _loadVideoFrameToCanvas() {
      const sourceImg = this.$refs.sourceImg
      const canvas = this.$refs['puzzle-canvas']
      const ctx = canvas.getContext('2d')
      const w = this.internalWidth
      const h = this.internalHeight
      const vw = sourceImg.videoWidth
      const vh = sourceImg.videoHeight
      const ratio = Math.max(w / vw, h / vh)

      // NOTE: iOS11 has a memory leak on canvas.drawImage with 9 args
      // if the image is scaled.
      // to prevent them I have to use 5 args version for scaling
      this._tmpCanvas.width = vw * ratio
      this._tmpCanvas.height = vh * ratio
      this._tmpCtx.drawImage(sourceImg, 0, 0, vw * ratio, vh * ratio)

      // copies clipped video source to canvas for sync drawing
      const marginX = (vw * ratio - w) / 2
      const marginY = (vh * ratio - h) / 2
      ctx.drawImage(this._tmpCanvas, marginX, marginY, w, h, w, 0, w, h)
    },
    slide(idx) {
      if (!this._isStarted) {
        this._isStarted = true
        this.$emit('start')
      }
      this.board.slide(idx)
      Vue.set(this, 'blocks', this.board.blocks.concat())
    },
    onTouchEnd(event) {
      if (this.isTouchNeeded) {
        this.$refs.sourceImg.play()
      }
      const touch = event.changedTouches[0]
      const rect = this.$el.getBoundingClientRect()
      const x = touch.clientX - rect.left
      const y = touch.clientY - rect.top
      this.handleClick(x, y)
    },
    onClick(event) {
      // NOTE: canvas is shifted to left when finished
      const x = event.offsetX - (this.isGoal ? this.width : 0)
      const y = event.offsetY
      this.handleClick(x, y)
    },
    handleClick(x, y) {
      x = x / this.cellWidth
      y = y / this.cellHeight
      const col = Math.floor(x)
      const row = Math.floor(y)
      const idx = row * this.cols + col
      this.slide(idx)
    },
    onClickBoard() {
      this.$el.focus()
    },
    onResize() {
      const w = this.$el.offsetWidth
      const h = this.$el.offsetHeight
      if (this.autoResize) {
        this.internalWidth = w
        this.internalHeight = h
      } else {
        this.internalWidth = this.width
        this.internalHeight = this.height
      }
      if (this.isImage) {
        this.$nextTick(this._loadImageToCanvas.bind(this))
      }
      this.updateBlockPositions(true)
    },
    onKeyUp(event) {
      const bp = this.board.blankpos
      const len = this.blocks.length
      switch (event.keyCode) {
        case 37:
          if (bp + 1 < len) {
            this.slide(bp + 1)
          }
          break
        case 38:
          if (bp + this.cols < len) {
            this.slide(bp + this.cols)
          }
          break
        case 39:
          if (bp - 1 >= 0) {
            this.slide(bp - 1)
          }
          break
        case 40:
          if (bp - this.cols >= 0) {
            this.slide(bp - this.cols)
          }
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#sourceImg,
#targetImg {
  width: 300;
  height: 300;
}
.puzzle-canvas {
  position: absolute;
  margin: 0;
  padding: 0;
  top: 0;
  left: 0;
  width: 200%;
  height: 100%;
}
.puzzle-message {
  position: absolute;
  width: 100%;
  height: 100%;
}
.puzzle-board {
  position: absolute;
  overflow: hidden;
  width: 100%;
  height: 100%;
}
.tile-number {
  position: absolute;
  text-shadow: 1px 1px 0 #222;
  color: #fafafa;
}
</style>
