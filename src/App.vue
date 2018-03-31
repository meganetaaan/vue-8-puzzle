<template>
  <div id="app">
    <div class="header">
      <span class="header-item title" @click="onTitleClick">Vue-8-Puzzle</span>
      <span class="header-item distance"> d: {{distance}} </span>
      <span class="header-item">
        <label for="showNumber">#:</label>
        <input type="checkbox" id="showNumber" v-model="showNumber" />
      </span>
      <span class="header-item">
        <label for="animation">a:</label>
        <input type="checkbox" id="animation" v-model="animation" />
      </span>
      <span class="header-item">
        <select v-model="videoTitle">
          <option>Dog</option>
          <option>Cat</option>
          <option>Penguin</option>
        </select>
      </span>
      <span class="header-item">
        <select v-model="difficulty">
          <option>Easy</option>
          <option>Normal</option>
          <option>Difficult</option>
        </select>
      </span>
      <span class="header-item">
        <template v-if="isGoal">
          finish!!
        </template>
      </span>
    </div>
    <div class="container">
      <puzzle-board
      :autoResize="autoResize"
      :showNumber="showNumber"
      :cols="dimensions.x"
      :rows="dimensions.y"
      :src="src"
      :sources="sources"
      :animation="animation"
      @init="onPuzzleBoardInit"
      @start="onPuzzleBoardStart"
      @change="onPuzzleBoardChange"
      @finish="onPuzzleBoardFinish"
      />
    </div>
  </div>
</template>

<script>
// import PuzzleBoard from './components/PuzzleBoard'
import PuzzleBoard from './components/PuzzleBoard.vue'
import penguinwebm from './assets/penguin.webm'
import penguinmp4 from './assets/penguin.mp4'
import catwebm from './assets/cat.webm'
import catmp4 from './assets/cat.mp4'
import dogjpg from './assets/dog.jpg'

const SOURCEPATHS = {
  Dog: {
    src: dogjpg
  },
  Cat: {
    sources: [{
      src: catwebm,
      type: 'video/webm'
    }, {
      src: catmp4,
      type: 'video/mp4'
    }]
  },
  Penguin: {
    sources: [{
      src: penguinwebm,
      type: 'video/webm'
    }, {
      src: penguinmp4,
      type: 'video/mp4'
    }]
  }
}
const DIMENSIONS = {
  Easy: {x: 3, y: 3},
  Normal: {x: 4, y: 4},
  Difficult: {x: 5, y: 5}
}
export default {
  name: 'App',
  components: {
    PuzzleBoard
  },
  data () {
    return {
      videoTitle: 'Cat',
      difficulty: 'Easy',
      distance: null,
      isGoal: false,
      autoResize: true,
      showNumber: false,
      animation: true
    }
  },
  computed: {
    sources () {
      return SOURCEPATHS[this.videoTitle].sources
    },
    src () {
      return SOURCEPATHS[this.videoTitle].src
    },
    dimensions () {
      return DIMENSIONS[this.difficulty]
    }
  },
  methods: {
    onTitleClick () {
      window.open('https://github.com/meganetaaan/vue-8-puzzle')
    },
    onPuzzleBoardInit () {
      console.log('init')
    },
    onPuzzleBoardStart () {
      console.log('start')
    },
    onPuzzleBoardFinish () {
      console.log('finish')
      this.isGoal = true
    },
    onPuzzleBoardChange (payload) {
      console.log('change')
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
