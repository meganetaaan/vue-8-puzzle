<template>
  <div id="app">
    <img src="./assets/logo.png">
    <canvas ref="cvs" />
    <puzzle-board/>
  </div>
</template>

<script>
import PuzzleBoard from './components/PuzzleBoard'

export default {
  name: 'App',
  components: {
    PuzzleBoard
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
