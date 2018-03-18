const SPACE: number = 0
enum Direction {
  Above = 'Above',
  Below = 'Below',
  Left = 'Left',
  Right = 'Right'
}

class Board {
  private dx: number
  private dy: number
  private blocks: Array<number>
  private blankpos: number

  constructor (blocks: Array<Array<number>>) {
    this.dy = blocks.length
    // use the length of the top of blocks
    this.dx = blocks[0].length
    if (this.dy < 2 || this.dx < 2) {
      // TODO: could drop some edge cases
      throw new Error('cannot initialize with the array which has less than 2 col/rows')
    }
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

  row (p: number): number {
    return Math.floor(p / this.dx)
  }

  col (p: number) {
    return p % this.dx
  }

  dimensions (): {x: number, y: number} {
    return {
      x: this.dx,
      y: this.dy
    }
  }

  checkInRange (...idxs: number[]) {
    for (let idx of idxs) {
      if (this.blocks[idx] == null) {
        throw new Error(`Index ${idx} not in range [0 .. ${this.blocks.length - 1}]`)
      }
    }
  }

  direction (from: number, to: number): null | Direction {
    this.checkInRange(from, to)
    if (this.row(to) === this.row(from)) {
      if (to % this.dx === (from % this.dx) - 1) {
        return Direction.Left
      }
      if (to % this.dx === (from % this.dx) + 1) {
        return Direction.Right
      }
    }
    if (to === from + this.dx) {
      return Direction.Below
    }
    if (to === from - this.dx) {
      return Direction.Above
    }
    return null
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
      const rowdiff = Math.abs(this.row(this.blocks[k] - 1) - this.row(k))
      const coldiff = Math.abs(this.col(this.blocks[k] - 1) - this.col(k))
      manhattan += rowdiff + coldiff
    }
    return manhattan
  }

  isGoal (): boolean {
    for (let k = 0, len = this.blocks.length; k < len; k++) {
      if (this.blocks[k] === SPACE) {
        continue
      } else if (this.blocks[k] !== k + 1) {
        return false
      }
    }
    return true
  }

  private swap (blocks: Array<number>, from: number, to: number): Board {
    this.checkInRange(from, to)
    if (this.blocks[from] !== SPACE && this.blocks[to] !== SPACE) {
      // cannot swap no-empty block
      throw new Error('cannot swap non-space block')
    }
    [blocks[from], blocks[to]] = [blocks[to], blocks[from]]
    this.blankpos = blocks[from] === SPACE ? from : to
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

  slide (idx: number): Board {
    this.checkInRange(idx)
    switch(this.direction(idx, this.blankpos)) {
      case Direction.Above:
        return this.swapAbove(idx)
      case Direction.Below:
        return this.swapBelow(idx)
      case Direction.Left:
        return this.swapLeft(idx)
      case Direction.Right:
        return this.swapRight(idx)
      default:
        return this
    }
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
