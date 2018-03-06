<template>
  <div id="app">
    <div class="header">
      Vue-8-Puzzle
      <div class="status">
        (Distance: {{distance}})
        <div v-if="isGoal">
          finish!!
        </div>
      </div>
    </div>
    <div class="container">
      <puzzle-board :src="imgSrc"
      @change="onPuzzleBoardChange"
      @finish="onPuzzleBoardFinish"
      :autoResize="autoResize"/>
    </div>
  </div>
</template>

<script>
import PuzzleBoard from './components/PuzzleBoard'
import imgSrc from './assets/robot.jpg'

export default {
  name: 'App',
  components: {
    PuzzleBoard
  },
  data () {
    return {
      imgSrc,
      distance: null,
      isGoal: false,
      autoResize: true
    }
  },
  methods: {
    onPuzzleBoardFinish () {
      this.isGoal = true
    },
    onPuzzleBoardChange (payload) {
      this.distance = payload.distance
    }
  }
}
</script>

<style>
html,body {
  margin: 0;
  padding: 0;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.header {
  z-index: 1;
  font-size: 1.2em;
  position: absolute;
  width: 100%;
  height: 60px;
  color: #FAFAFA;
  background-color: #283593;
  box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
}
.container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  margin: 0px;
  padding: 0px;
  max-width: 600px;
  max-height: 600px;
}
</style>
