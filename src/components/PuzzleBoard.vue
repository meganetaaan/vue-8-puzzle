<template>
  <div>
    <div class="puzzle-board">
      <transition-group>
        <div class="block" v-for="(block, idx) of blocks" :key="block" :style="getBlockStyle(block, idx)"
        @click="onClick(idx)"
        @mousedown.prevent
        @mouseup.prevent
        >
          <img v-if="src" :style="getImageStyle(block, idx)" :src="src" />
          <div :style="{position: 'absolute', fontColor: '#ddd'}">{{block === 0 ? '' : block}}</div>
        </div>
      </transition-group>
      <!-- <video ref="sourceImg" autoplay loop width="300" height="300" :src="vidSrc">No video</video>
      <canvas ref="canvas" id="targetImg" /> -->
    </div>
  </div>
</template>

<script>
// import vid from '../assets/me.webm'
import Board from '../board.ts'
import Vue from 'vue'

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
      // vidSrc: vid,
      targetSrc: null,
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
    this.width = this.$el.offsetWidth
    this.height = this.$el.offsetHeight
    // const loop = () => {
    //   const sourceImg = this.$refs.sourceImg
    //   const ctx = this.$refs.canvas.getContext('2d')
    //   const sourceX = 200
    //   const sourceY = 200
    //   const sourceWidth = 300
    //   const sourceHeight = 300
    //   const targetX = 0
    //   const targetY = 0
    //   const targetWidth = 100
    //   const targetHeight = 100
    //   ctx.drawImage(sourceImg, sourceX, sourceY, sourceWidth, sourceHeight, targetX, targetY, targetWidth, targetHeight)
    //   requestAnimationFrame(loop)
    // }
    // this.$nextTick(loop)
  },
  watch: {
    board () {
      console.log()
      this.blocks = this.board.blocks
      this.dx = this.board.dx
      this.dy = this.board.dy
    },
    blocks () {
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
    getImageStyle (block, idx) {
      const col = this.board.col(block) - 1
      const row = this.board.row(block) - 1
      const tx = this.cellHeight * col
      const ty = this.cellWidth * row
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
        display: isBlank ? 'none' : 'inherit',
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
    onClick (idx) {
      this.board.slide(idx)
      Vue.set(this, 'blocks', this.board.blocks.concat())
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
.puzzle-board {
  position: absolute;
  width: 100%;
  height: 100%;
}
.block {
  transition: all .3s ease,
}
</style>
