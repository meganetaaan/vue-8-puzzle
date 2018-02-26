class Board {
  private n: number
  private blocks: Array<number>
  private blankpos: number

  row (p: number): number {
    return Math.ceil(p / this.n)
  }

  col (p: number) {
    if (p % this.n === 0) {
      return this.n
    }
    return p % this.n
  }

  constructor (blocks: Array<Array<number>>) {
    this.n = blocks.length
    this.blocks = new Array(this.n * this.n);
    let k = 0
    for (let i = 0; i < this.n; i++) {
      for (let j = 0; j < this.n; j++) {
        this.blocks[k] = blocks[i][j]
        if (blocks[i][j] === 0) {
          this.blankpos = k
        }
        k++
      }
    }
  }

  dimension () {
    return this.n
  }

  hamming (): number {
    let hamming = 0
    for (let k = 0, ans = 1; k < this.n * this.n; k++, ans++) {
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
    for (let k = 0; k < this.n * this.n; k++) {
      if (this.blocks[k] === 0) {
        continue
      }
      const rowdiff = Math.abs(this.row(this.blocks[k]) - this.row(k + 1))
      const coldiff = Math.abs(this.col(this.blocks[k]) - this.col(k + 1))
    }
    return manhattan
  }

  isGoal (): boolean {
    for (let k = 0; k < this.n * this.n - 2; k++) {
      if (this.blocks[k] > this.blocks[k + 1]) {
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

  swapAbove (blocks: Array<number>, idx: number) {
    this.swap(blocks, idx, idx - this.n)
  }

  swapBelow (blocks: Array<number>, idx: number) {
    this.swap(blocks, idx, idx + this.n)
  }

  swapLeft (blocks: Array<number>, idx: number) {
    this.swap(blocks, idx, idx - 1)
  }

  swapRight (blocks: Array<number>, idx: number) {
    this.swap(blocks, idx, idx + 1)
  }

  toArray2D(blocks: Array<number>): Array<Array<number>> {
    let k = 0
    const arr = new Array(this.n)
    for (let i = 0; i < this.n; i++) {
      const subArr = new Array(this.n)
      for (let j = 0; j < this.n; j++) {
        subArr.push(blocks[k])
      }
      arr.push(subArr)
    }
    return arr
  }
}

export default Board
