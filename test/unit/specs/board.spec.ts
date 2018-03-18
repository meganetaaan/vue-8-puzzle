import Board from '@/board'
import assert from 'power-assert'
import 'jest'

describe('board', () => {
  var board
  beforeEach(() => {
    const array2D = [[0, 1, 2], [3, 4, 5]]
    board = new Board(array2D)
  })
  it('should throw error when the array has less than two row/col', () => {
    assert.throws(() => {
      const b = new Board([[0, 1, 2]])
    })
    assert.throws(() => {
      const b = new Board([[0], [1]])
    })
  })
  it('should render correct contents', () => {
    assert(board != null)
  })
  it('should return row and col', () => {
    assert.equal(board.col(1), 1)
    assert.equal(board.col(3), 0)
    assert.equal(board.col(4), 1)
    assert.equal(board.row(1), 0)
    assert.equal(board.row(3), 1)
    assert.equal(board.row(4), 1)
  })
  it('should return dimensions', () => {
    const d = board.dimensions()
    assert(d.x === 3)
    assert.equal(d.y, 2)
  })
  it('should return hamming distance', () => {
    assert.equal(board.hamming(), 5)
    assert.equal(new Board([[1, 2, 3], [4, 5, 0]]).hamming(), 0)
  })
  it('should return manhattan distance', () => {
    assert.equal(board.manhattan(), 7)
    assert.equal(new Board([[1, 2, 3], [5, 4, 0]]).manhattan(), 2)
    assert.equal(new Board([[1, 2, 3], [4, 5, 0]]).manhattan(), 0)
  })
  it('should return true when isGoal', () => {
    assert(!board.isGoal())
    const goalBoard = new Board([[1, 2, 3], [4, 5, 0]])
    assert(goalBoard.isGoal())
  })
  it('should swap panels', () => {
    board.swapBelow(0)
    assert.equal(board.blocks[0], 3)
    assert.equal(board.blocks[3], 0)
    assert.equal(board.blankpos, 3)

    board.swapRight(3)
    assert.equal(board.blocks[3], 4)
    assert.equal(board.blocks[4], 0)
    assert.equal(board.blankpos, 4)

    board.swapAbove(4)
    assert.equal(board.blocks[4], 1)
    assert.equal(board.blocks[1], 0)
    assert.equal(board.blankpos, 1)

    board.swapLeft(1)
    assert.equal(board.blocks[1], 3)
    assert.equal(board.blocks[0], 0)
    assert.equal(board.blankpos, 0)

    board.swapAbove(3)
    assert.equal(board.blocks[3], 0)
    assert.equal(board.blocks[0], 4)
    assert.equal(board.blankpos, 3)
  })
  it('should throw error when no-empty block swapped', () => {
    assert.throws(() => {
      board.swapBelow(1)
    })
  })
  it('should throw error when blocks out of range swapped', () => {
    assert.throws(() => {
      board.swapAbove(0)
    })
  })
  it('should convert to Array2D', () => {
    assert.deepEqual(board.toArray2D(), [[0, 1, 2], [3, 4, 5]])
  })
  it('should slide blocks', () => {
    board.slide(1)
    board.slide(4)
    board.slide(3)
    board.slide(2)
    board.slide(0)
    board.slide(5)
    assert.deepEqual(board.toArray2D(), [[0, 4, 2], [1, 3, 5]])
  })
})
