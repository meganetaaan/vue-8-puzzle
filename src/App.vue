<template>
  <div id="app">
    <div class="header">
      <span class="header-item title">Vue-8-Puzzle</span>
      <span class="header-item distance"> Distance: {{distance}} </span>
      <span class="header-item">
        <label for="showNumber">Show Number:</label>
        <input type="checkbox" id="showNumber" v-model="showNumber" />
      </span>
      <span class="header-item">
        <template v-if="isGoal">
          finish!!
        </template>
      </span>
    </div>
    <div class="container">
      <puzzle-board
      :src="imgSrc"
      :autoResize="autoResize"
      :showNumber="showNumber"
      @change="onPuzzleBoardChange"
      @finish="onPuzzleBoardFinish"
      />
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
      autoResize: true,
      showNumber: false
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
  background-color: #F0F0F0;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.header {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  z-index: 1;
  font-size: 1.4em;
  position: absolute;
  width: 100%;
  height: 60px;
  color: #FAFAFA;
  background-color: #283593;
  box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
}
.header-item {
  flex-grow: 1;
}
.title {
  font-weight: bold;
}
.container {
  position: absolute;
  top: calc(50% + 30px);
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 2px 4px rgba(0,0,0,0.16), 0 2px 4px rgba(0,0,0,0.23);
  width: 100%;
  height: calc(100% - 60px);
  margin: 0px;
  padding: 0px;
  max-width: 600px;
  max-height: 600px;
  background-color: #DDD;
}
</style>
