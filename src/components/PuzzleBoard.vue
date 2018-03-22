<template>
  <div class="puzzle-board"
  tabindex="-1"
  @keyup.prevent="onKeyUp"
  @click="onClickBoard"
  >
    <div class="puzzle-message" v-if="isTouchNeeded">Touch to start</div>
    <canvas ref="puzzle-canvas" class="puzzle-canvas"
    @click.prevent
    @mousedown.prevent
    @mouseup.prevent="onClick"
    @touchend.prevent="onTouchEnd"
    :style="getCanvasStyle()"
    :width="width * 2"
    :height="height"
    ></canvas>
    <video ref="sourceImg"
    autoplay
    loop
    playsinline
    muted="true"
    :style="getSourceStyle()"
    :width="width"
    :height="height">
    <source v-for="source of sources" v-bind:key="source.src" :src="source.src" :type="source.type" />
    No video</video>
  </div>
</template>

<script>
import Board from '../board.ts'
import Vue from 'vue'
import posterSrc from '../assets/robot.jpg'
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
  data () {
    this._blockPositions = []
    this._isStarted = false
    const board = createRandomBoard2D(this.dx, this.dy)
    return {
      isTouchNeeded: true,
      blocks: board.blocks,
      isGoal: false,
      manhattan: null,
      hamming: null,
      width: 0,
      height: 0,
      targetSrc: this.src,
      posterSrc: posterSrc,
      board: board
    }
  },
  props: {
    animation: {
      type: Boolean,
      default: true
    },
    dx: {
      type: Number,
      default: 4
    },
    dy: {
      type: Number,
      default: 4
    },
    sources: {
      required: true
    },
    showNumber: {
      type: Boolean,
      default: true
    },
    autoResize: {
      type: Boolean,
      default: false
    },
    fps: {
      type: Number,
      default: 30
    }
  },
  computed: {
    cellWidth () {
      return this.width / this.dx
    },
    cellHeight () {
      return this.height / this.dy
    }
  },
  mounted () {
    this.onResize()
    this.updateBlockPositions(!this.animation)
    window.addEventListener('resize', debounce(this.onResize.bind(this), 300))
    this._lastRenderVideoTime = -1
    this._lastRenderTime = 0
    this.$refs.sourceImg.addEventListener('play', () => {
      this.isTouchNeeded = false
    })
    const loop = () => {
      TWEEN.update()
      if (this.$refs.sourceImg == null) {
        requestAnimationFrame(loop)
        return
      }
      const sourceImg = this.$refs.sourceImg
      const now = Date.now()
      if (sourceImg.currentTime !== this._lastRender && now - this._lastRenderTime > (1000 / this.fps)) {
        this._lastRenderVideoTime = sourceImg.currentTime
        this._lastRenderTime = now
        // TODO: choose trimming strategy
        // trims square area from the center of the source
        const sourceCellSize = Math.min(sourceImg.videoWidth / this.dx, sourceImg.videoHeight / this.dy)
        const marginX = (sourceImg.videoWidth - sourceCellSize * this.dx) / 2
        const marginY = (sourceImg.videoHeight - sourceCellSize * this.dy) / 2
        const canvas = this.$refs['puzzle-canvas']
        const ctx = canvas.getContext('2d')
        const sourceWidth = sourceCellSize * this.dx
        const sourceHeight = sourceCellSize * this.dy
        const w = this.width
        const h = this.height

        ctx.clearRect(0, 0, this.width, this.height)

        // copies clipped video source to canvas for sync drawing
        ctx.drawImage(sourceImg, marginX, marginY, sourceWidth, sourceHeight, w, 0, w, h)

        if (this.isGoal) {
          requestAnimationFrame(loop)
          return
        }

        // number
        ctx.font = "24px 'Avenir', Helvetica, Arial, sans-serif"
        ctx.fillStyle = '#fafafa'
        ctx.textBaseline = 'top'
        if (this.showNumber) {
          for (let i = 0, len = this.blocks.length; i < len; i++) {
            const r = Math.floor(i / this.dx)
            const c = i % this.dx
            const text = String(i + 1)
            const margin = 5
            ctx.strokeText(text, margin + w + this.cellWidth * c, margin + this.cellHeight * r)
            ctx.fillText(text, margin + w + this.cellWidth * c, margin + this.cellHeight * r)
          }
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
          ctx.drawImage(canvas,
            sourceX, sourceY, this.cellWidth, this.cellHeight,
            targetX, targetY, this.cellWidth, this.cellHeight)
        }
      }
      requestAnimationFrame(loop)
    }
    this.$nextTick(loop)
    this.$emit('init')
  },
  watch: {
    dx () {
      this.initBoard()
    },
    dy () {
      this.initBoard()
    },
    board () {
      this.blocks = this.board.blocks
    },
    blocks () {
      this.updateBlockPositions(!this.animation)
      this.isGoal = this.board.isGoal()
      this.manhattan = this.board.manhattan()
      this.hamming = this.board.hamming()
      this.$emit('change', {
        blocks: this.blocks,
        isGoal: this.isGoal,
        distance: this.manhattan
      })
    },
    isGoal () {
      if (this.isGoal) {
        this.$emit('finish')
      }
    }
  },
  methods: {
    initBoard () {
      this.board = createRandomBoard2D(this.dx, this.dy)
      this._isStarted = false
      this.$emit('init')
    },
    updateBlockPositions (isImmediate) {
      for (let i = 0, len = this.blocks.length; i < len; i++) {
        const b = this.blocks[i]
        const col = this.board.col(i)
        const row = this.board.row(i)
        const x = this.cellWidth * col
        const y = this.cellHeight * row
        const from = this._blockPositions[b] || {x: 0, y: 0}
        if (this._blockPositions[b] == null) {
          this._blockPositions[b] = from
        }
        if (from.x - x === 0 && from.y - y === 0) {
          continue
        }
        const obj = {x: from.x, y: from.y}
        if (isImmediate) {
          this._blockPositions[b].x = x
          this._blockPositions[b].y = y
        } else {
          new TWEEN.Tween(obj)
            .to({x, y}, 200)
            .easing(TWEEN.Easing.Quadratic.Out)
            .onUpdate(() => {
              this._blockPositions[b].x = obj.x
              this._blockPositions[b].y = obj.y
            })
            .start()
        }
      }
    },
    getCanvasStyle () {
      return {
        left: this.isGoal ? '-100%' : 0
      }
    },
    getSourceStyle () {
      return {
        display: 'none'
      }
    },
    slide (idx) {
      if (!this._isStarted) {
        this._isStarted = true
        this.$emit('start')
      }
      this.board.slide(idx)
      Vue.set(this, 'blocks', this.board.blocks.concat())
    },
    onTouchEnd (event) {
      if (this.isTouchNeeded) {
        this.$refs.sourceImg.play()
        this.isTouchNeeded = false
      }
      const touch = event.changedTouches[0]
      const rect = this.$el.getBoundingClientRect()
      const ev = {
        offsetX: touch.clientX - rect.left,
        offsetY: touch.clientY - rect.top
      }
      this.onClick(ev)
    },
    onClick (event) {
      const col = Math.floor(event.offsetX / this.cellWidth)
      const row = Math.floor(event.offsetY / this.cellHeight)
      const idx = row * this.dx + col
      this.slide(idx)
    },
    onClickBoard () {
      this.$el.focus()
    },
    onResize () {
      const w = this.$el.offsetWidth
      const h = this.$el.offsetHeight
      if (this.autoResize) {
        this.width = w
        this.height = h
      }
      this.updateBlockPositions(true)
    },
    onKeyUp (event) {
      const bp = this.board.blankpos
      const len = this.blocks.length
      switch (event.keyCode) {
        case 37:
          if (bp + 1 < len) {
            this.slide(bp + 1)
          }
          break
        case 38:
          if (bp + this.dx < len) {
            this.slide(bp + this.dx)
          }
          break
        case 39:
          if (bp - 1 >= 0) {
            this.slide(bp - 1)
          }
          break
        case 40:
          if (bp - this.dx >= 0) {
            this.slide(bp - this.dx)
          }
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#sourceImg,#targetImg {
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
  color: #FAFAFA;
}
</style>
