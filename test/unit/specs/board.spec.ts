import Board from '@/board'
import assert from 'power-assert'
import 'jest'

describe('board', () => {
  var board
  beforeEach(() => {
    const array2D = [[0, 1, 2], [3, 4, 5]]
    board = new Board(array2D)
  })
  it('should render correct contents', () => {
    assert(board != null)
  })
  it('should return row and col', () => {
    assert.equal(board.col(5), 2)
    assert.equal(board.col(3), 3)
    assert.equal(board.row(5), 2)
  })
  it('should return dimensions', () => {
    const d = board.dimensions()
    assert(d.x === 3)
    assert.equal(d.y, 2)
  })
  it('should return hamming distance', () => {
    assert.equal(board.hamming(), 5)
  })
  it('should return manhattan distance', () => {
    assert.equal(board.manhattan(), 0)
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

    board.swapRight(3)
    assert.equal(board.blocks[3], 4)
    assert.equal(board.blocks[4], 0)

    board.swapAbove(4)
    assert.equal(board.blocks[4], 1)
    assert.equal(board.blocks[1], 0)

    board.swapLeft(1)
    assert.equal(board.blocks[1], 3)
    assert.equal(board.blocks[0], 0)
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
})
