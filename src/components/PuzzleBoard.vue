<template>
  <div class="puzzle-board"
  tabindex="-1"
  @keyup.prevent="onKeyUp"
  @click="onClickBoard"
  >
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
    muted="true"
    :style="getSourceStyle()"
    :width="width"
    :height="height"
    :src="vidSrc">No video</video>
  </div>
</template>

<script>
import vid from '../assets/cat.webm'
import Board from '../board.ts'
import Vue from 'vue'
import posterSrc from '../assets/robot.jpg'
import debounce from 'lodash.debounce'

const shuffle = (arr) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const r = Math.floor(Math.random() * (i + 1))
    let tmp = arr[i]
    arr[i] = arr[r]
    arr[r] = tmp
  }
  return arr
}
const createBoard2D = (dx, dy) => {
  const len = dx * dy
  const arr = []
  for (let i = 0; i < len; i++) {
    arr.push(i)
  }
  shuffle(arr)
  const result = []
  for (let i = 0; i < dy; i++) {
    const sub = []
    for (let j = 0; j < dx; j++) {
      sub.push(arr[dx * i + j])
    }
    result.push(sub)
  }
  return result
}

export default {
  name: 'PuzzleBoard',
  data () {
    return {
      blocks: this.board.blocks,
      isGoal: false,
      manhattan: null,
      hamming: null,
      width: 0,
      height: 0,
      vidSrc: vid,
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
        return new Board(board2D)
      }
    },
    src: {
      type: String
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
    window.addEventListener('resize', debounce(this.onResize.bind(this), 300))
    this._lastRender = -1
    const loop = () => {
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

        // copies clipped video source to canvas for sync drawing
        ctx.drawImage(sourceImg, marginX, marginY, sourceWidth, sourceHeight, w, 0, w, h)

        if (this._shouldClear) {
          ctx.clearRect(0, 0, this.width, this.height)
        }
        for (let i = 0, len = this.blocks.length; i < len; i++) {
          const block = this.blocks[i]
          if (block === 0) {
            continue
          }
          const row = this.board.row(block)
          const col = this.board.col(block)
          const targetWidth = this.cellWidth
          const targetHeight = this.cellHeight
          const sourceX = targetWidth * (col - 1) + w
          const sourceY = targetHeight * (row - 1)
          const sourceWidth = targetWidth
          const sourceHeight = targetHeight
          const targetY = (this.board.row(i + 1) - 1) * this.cellHeight
          const targetX = (this.board.col(i + 1) - 1) * this.cellWidth
          ctx.drawImage(canvas, sourceX, sourceY, sourceWidth, sourceHeight, targetX, targetY, targetWidth, targetHeight)
        }
      }
      requestAnimationFrame(loop)
    }
    this.$nextTick(loop)
  },
  watch: {
    board () {
      this.blocks = this.board.blocks
      this.dx = this.board.dx
      this.dy = this.board.dy
    },
    blocks () {
      this.isGoal = this.board.isGoal()
      this.manhattan = this.board.manhattan()
      this.hamming = this.board.hamming()
      this.clearCanvas()
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
    getImageStyle (block, idx) {
      const col = this.board.col(block) - 1
      const row = this.board.row(block) - 1
      const tx = this.cellWidth * col
      const ty = this.cellHeight * row
      return {
        position: 'absolute',
        margin: 0,
        padding: 0,
        width: `${this.width}px`,
        height: `${this.height}px`,
        transform: `translate(-${tx}px, -${ty}px`
      }
    },
    getBlockStyle (block, idx) {
      const isBlank = block === 0
      const top = (this.board.row(idx + 1) - 1) * this.cellHeight
      const left = (this.board.col(idx + 1) - 1) * this.cellWidth
      const style = {
        userSelect: 'none',
        display: isBlank || this.isGoal ? 'none' : 'inherit',
        textAlign: 'left',
        fontSize: '2em',
        boxSizing: 'border-box',
        border: isBlank ? '' : '1px solid black',
        backgroundColor: isBlank ? '' : '#FFF',
        position: 'absolute',
        left: `${left}px`,
        top: `${top}px`,
        height: `${this.cellHeight}px`,
        width: `${this.cellWidth}px`,
        overflow: 'hidden'
      }
      return style
    },
    getCanvasStyle () {
      return {
        left: this.isGoal ? '-100%' : 0
      }
    },
    getSourceStyle () {
      return {
        position: 'absolute',
        display: this.isGoal ? 'block' : 'none',
        top: 0,
        left: 0
      }
    },
    clearCanvas () {
      this._shouldClear = true
      // const ctx = this.$refs['puzzle-canvas'].getContext('2d')
      // ctx.clearRect(0, 0, this.width, this.height)
    },
    slide (idx) {
      this.board.slide(idx)
      Vue.set(this, 'blocks', this.board.blocks.concat())
    },
    onTouchEnd (event) {
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
      if (this.$refs.sourceImg.currentTime < 0.01) {
        this.$refs.sourceImg.play()
      }
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
.puzzle-board {
  position: absolute;
  overflow: hidden;
  width: 100%;
  height: 100%;
  background-color: #FAFAFA;
}
.block {
  /* transition: all .3s ease; */
}
.tile-number {
  position: absolute;
  text-shadow: 1px 1px 0 #222;
  color: #FAFAFA;
}
</style>
