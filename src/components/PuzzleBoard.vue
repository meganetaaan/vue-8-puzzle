<template>
  <div>
    <div class="status">
      (Distance: {{manhattan}})
      <div v-if="isGoal">
        finish!!
      </div>
    </div>
    <div class="puzzle-board">
      <transition-group>
        <div class="block" v-for="(block, idx) of blocks" :key="block" :style="getBlockStyle(block, idx)" @click="onClick(idx)">
          {{block === 0 ? '' : block}}
        </div>
      </transition-group>
      <!-- <video ref="sourceImg" autoplay loop width="300" height="300" :src="vidSrc">No video</video>
      <canvas ref="canvas" id="targetImg" /> -->
    </div>
  </div>
</template>

<script>
// import gif from '../assets/maze-resize.gif'
// import vid from '../assets/me.webm'
import Board from '../board.ts'
import Vue from 'vue'

export default {
  name: 'PuzzleBoard',
  data () {
    const board = new Board([[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 0]])
    return {
      board,
      blocks: board.blocks,
      isGoal: false,
      manhattan: null,
      hamming: null,
      // src: gif,
      // vidSrc: vid,
      targetSrc: null,
      cellWidth: 200,
      cellHeight: 200
    }
  },
  mounted () {
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
    blocks () {
      this.isGoal = this.board.isGoal()
      this.manhattan = this.board.manhattan()
      this.hamming = this.board.hamming()
    }
  },
  methods: {
    getBlockStyle (block, idx) {
      const isBlank = block === 0
      const top = (this.board.row(idx + 1) - 1) * this.cellHeight
      const left = (this.board.col(idx + 1) - 1) * this.cellWidth
      const style = {
        textAlign: 'left',
        padding: '5px',
        fontSize: '2em',
        boxSizing: 'border-box',
        border: isBlank ? '' : '1px solid black',
        backgroundColor: isBlank ? '' : '#FFF',
        position: 'absolute',
        left: `${left}px`,
        top: `${top}px`,
        height: `${this.cellHeight}px`,
        width: `${this.cellWidth}px`
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
  width: 600px;
  height: 600px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.block {
  transition: all .3s ease,
}
</style>
