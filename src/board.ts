class Board {
  private dx: number
  private dy: number
  private blocks: Array<number>
  private blankpos: number

  row (p: number): number {
    // TODO: boundary check
    return Math.ceil(p / this.dx)
  }

  col (p: number) {
    // TODO: boundary check
    if (p % this.dx === 0) {
      return this.dx
    }
    return p % this.dx
  }

  constructor (blocks: Array<Array<number>>) {
    this.dy = blocks.length
    // use the length of the top of blocks
    this.dx = blocks[0].length
    this.blocks = new Array(this.dx * this.dy);
    let k = 0
    for (let i = 0; i < this.dy; i++) {
      for (let j = 0; j < this.dx; j++) {
        this.blocks[k] = blocks[i][j]
        if (blocks[i][j] === 0) {
          this.blankpos = k
        }
        k++
      }
    }
  }

  dimensions () {
    return {
      x: this.dx,
      y: this.dy
    }
  }

  hamming (): number {
    let hamming = 0
    for (let k = 0, ans = 1, len = this.blocks.length; k < len; k++, ans++) {
      if (this.blocks[k] === 0) {
        continue
      }
      if (this.blocks[k] !== ans) {
        hamming++
      }
    }
    return hamming
  }

  manhattan (): number {
    let manhattan = 0
    for (let k = 0, len = this.blocks.length; k < len; k++) {
      if (this.blocks[k] === 0) {
        continue
      }
      const rowdiff = Math.abs(this.row(this.blocks[k]) - this.row(k + 1))
      const coldiff = Math.abs(this.col(this.blocks[k]) - this.col(k + 1))
    }
    return manhattan
  }

  isGoal (): boolean {
    for (let k = 0, len = this.blocks.length; k < len - 2; k++) {
      if (this.blocks[k] === 0) {
        continue
      } else if (this.blocks[k] !== k + 1) {
        return false
      }
    }
    return true
  }

  swap (blocks: Array<number>, from: number, to: number) {
    if (blocks[from] != null && blocks[to] != null) {
      [blocks[from], blocks[to]] = [blocks[to], blocks[from]]
    }
  }

  swapAbove (idx: number) {
    // TODO: range check
    this.swap(this.blocks, idx, idx - this.dx)
  }

  swapBelow (idx: number) {
    this.swap(this.blocks, idx, idx + this.dx)
  }

  swapLeft (idx: number) {
    this.swap(this.blocks, idx, idx - 1)
  }

  swapRight (idx: number) {
    this.swap(this.blocks, idx, idx + 1)
  }

  toArray2D(): Array<Array<number>> {
    let k = 0
    const arr = []
    for (let i = 0; i < this.dy; i++) {
      const subArr = []
      for (let j = 0; j < this.dx; j++, k++) {
        subArr.push(this.blocks[k])
      }
      arr.push(subArr)
    }
    return arr
  }
}

export default Board
