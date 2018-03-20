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
import vid from '../assets/cat.webm'
import vid2 from '../assets/cat.mp4'
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

export default {
  name: 'PuzzleBoard',
  data () {
    this._blockPositions = []
    this._isStarted = false
    return {
      isTouchNeeded: true,
      blocks: this.board.blocks,
      isGoal: false,
      manhattan: null,
      hamming: null,
      width: 0,
      height: 0,
      targetSrc: this.src,
      posterSrc: posterSrc,
      dx: this.board.dx,
      dy: this.board.dx
    }
  },
  props: {
    board: {
      type: Board,
      default: () => {
        const board2D = createBoard2D(3, 3)
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
    },
    sources: {
      default: () => {
        return [{
          src: vid,
          type: 'video/webm'
        }, {
          src: vid2,
          type: 'video/mp4'
        }]
      }
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
    cellWidth () {
      return this.width / this.dx
    },
    cellHeight () {
      return this.height / this.dy
    }
  },
  mounted () {
    this.onResize()
    this.updateBlockPositions()
    window.addEventListener('resize', debounce(this.onResize.bind(this), 300))
    this._lastRender = -1
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
      if (sourceImg.currentTime !== this._lastRender) {
        this._lastRender = sourceImg.currentTime
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
    board () {
      this.$emit('init')
      this.blocks = this.board.blocks
      this.dx = this.board.dx
      this.dy = this.board.dy
    },
    blocks () {
      this.updateBlockPositions()
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
    updateBlockPositions () {
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
        new TWEEN.Tween(obj)
          .to({x, y}, 200)
          .easing(TWEEN.Easing.Quadratic.Out)
          .onUpdate(() => {
            this._blockPositions[b].x = obj.x
            this._blockPositions[b].y = obj.y
          })
          .start()
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
      this.updateBlockPositions()
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
