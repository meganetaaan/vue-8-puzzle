<template>
  <div class="puzzle-board">
    <video ref="sourceImg" autoplay loop width="300" height="300" :src="vidSrc">No video</video>
    <canvas ref="canvas" id="targetImg" />
  </div>
</template>

<script>
import gif from '../assets/maze-resize.gif'
import vid from '../assets/me.webm'

export default {
  name: 'PuzzleBoard',
  data () {
    return {
      board: [[1, 2, 3], [4, 5, 6], [7, 8, 9]],
      src: gif,
      vidSrc: vid,
      targetSrc: null
    }
  },
  mounted () {
    const loop = () => {
      const sourceImg = this.$refs.sourceImg
      const ctx = this.$refs.canvas.getContext('2d')
      const sourceX = 0
      const sourceY = 0
      const sourceWidth = 100
      const sourceHeight = 100
      const targetX = 0
      const targetY = 0
      const targetWidth = sourceWidth
      const targetHeight = sourceHeight
      ctx.drawImage(sourceImg, sourceX, sourceY, sourceWidth, sourceHeight, targetX, targetY, targetWidth, targetHeight)
      requestAnimationFrame(loop)
    }
    this.$nextTick(loop)
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
