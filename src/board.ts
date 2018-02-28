const SPACE: number = 0
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
    if (p % this.dx === SPACE) {
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
        if (blocks[i][j] === SPACE) {
          this.blankpos = k
        }
        k++
      }
    }
  }

  dimensions (): {x: number, y: number} {
    return {
      x: this.dx,
      y: this.dy
    }
  }

  hamming (): number {
    let hamming = 0
    for (let k = 0, ans = 1, len = this.blocks.length; k < len; k++, ans++) {
      if (this.blocks[k] === SPACE) {
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
      if (this.blocks[k] === SPACE) {
        continue
      }
      const rowdiff = Math.abs(this.row(this.blocks[k]) - this.row(k + 1))
      const coldiff = Math.abs(this.col(this.blocks[k]) - this.col(k + 1))
    }
    return manhattan
  }

  isGoal (): boolean {
    for (let k = 0, len = this.blocks.length; k < len - 2; k++) {
      if (this.blocks[k] === SPACE) {
        continue
      } else if (this.blocks[k] !== k + 1) {
        return false
      }
    }
    return true
  }

  swap (blocks: Array<number>, from: number, to: number): Board {
    if (this.blocks[from] == null || this.blocks[to] == null) {
      // cannot swap blocks out of range
      throw new Error('cannot swap blocks out of range')
    }
    if (this.blocks[from] !== SPACE && this.blocks[to] !== SPACE) {
      // cannot swap no-empty block
      throw new Error('cannot swap non-space block')
    }
    [blocks[from], blocks[to]] = [blocks[to], blocks[from]]
    return this
  }

  swapAbove (idx: number): Board {
    return this.swap(this.blocks, idx, idx - this.dx)
  }

  swapBelow (idx: number): Board {
    return this.swap(this.blocks, idx, idx + this.dx)
  }

  swapLeft (idx: number): Board {
    return this.swap(this.blocks, idx, idx - 1)
  }

  swapRight (idx: number): Board {
    return this.swap(this.blocks, idx, idx + 1)
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
