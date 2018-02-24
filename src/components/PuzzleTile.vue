<template>
  <div class="puzzle-tile">
    <img :src="src" alt="puzzle">
  </div>
</template>

<script>
import gif from '../assets/maze-resize.gif'
export default {
  name: 'PuzzleTile',
  data () {
    return {
      src: gif
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
