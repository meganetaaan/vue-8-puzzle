Vue-8-puzzle
===

An itty-bitty 8-puzzle game made as Vue.js component

[PLAY DEMO](https://meganetaaan.github.io/vue-8-puzzle/)

![maze-vue](doc/maze-vue.png)

## Install

```bash
$ npm install vue-8-puzzle --save
```

```JavaScript
import Vue from 'vue'
import PuzzleBoard from 'vue-8-puzzle'
import videoSrc from 'myvideo.webm'

let v = new Vue({
  el: '#app',
  template: `
    <app>
      <puzzle-board
      :src="videoSrc" />
    </app>`,
  components: {
    PuzzleBoard
  }
})
```

## Props

Props      | Type   | Description                  | Default
-----------|--------|------------------------------|--------------------------------
src | string | source path(required) |
board | Array<Array<number>> | A 2d array of tile number | random 3 x 3 array
autoResize | boolean | when true the component fits to its root automatically | false
showNumber | boolean | when true the component shows tile numbers on the video | true

## Events

Event    | Payload | Description
---------|---------|------------------------------------
init     | none    | the puzzle is initialized
start    | none    | the tile start to move
change   | none    | the tile changes
finish   | none    | all the tile is on correct position
