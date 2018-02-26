<template>
  <div class="puzzle-board">
    <video ref="sourceImg" autoplay loop width="300" height="300" :src="vidSrc">No video</video>
    <canvas ref="canvas" id="targetImg" />
  </div>
</template>

<script>
import gif from '../assets/maze-resize.gif'
import vid from '../assets/me.webm'
import Board from '../board.ts'

export default {
  name: 'PuzzleBoard',
  data () {
    const board = new Board([[1, 2, 3], [4, 5, 6], [7, 8]])
    return {
      board,
      src: gif,
      vidSrc: vid,
      targetSrc: null
    }
  },
  mounted () {
    const loop = () => {
      const sourceImg = this.$refs.sourceImg
      const ctx = this.$refs.canvas.getContext('2d')
      const sourceX = 200
      const sourceY = 200
      const sourceWidth = 300
      const sourceHeight = 300
      const targetX = 0
      const targetY = 0
      const targetWidth = 100
      const targetHeight = 100
      ctx.drawImage(sourceImg, sourceX, sourceY, sourceWidth, sourceHeight, targetX, targetY, targetWidth, targetHeight)
      requestAnimationFrame(loop)
    }
    this.$nextTick(loop)
  },
  methods: {
    render () {
      this.tiles.forEach(() => {

      })
    },
    renderTile () {

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
</style>
