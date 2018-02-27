import Board from '@/board'
import assert from 'power-assert'
import 'jest'

describe('board', () => {
  var board
  beforeEach(() => {
    board = new Board([[0, 1, 2], [3, 4, 5]])
  })
  it('should render correct contents', () => {
    assert(board != null)
  })
  it('should return row and col', () => {
    assert.equal(board.col(5), 2)
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
    assert.equal(board.isGoal(), false)
  })
  it('should swap panels', () => {
    board.swapAbove(4)
    assert.equal(board.blocks[1], 4)
    assert.equal(board.blocks[4], 1)
    board.swapBelow(0)
    assert.equal(board.blocks[0], 3)
    assert.equal(board.blocks[3], 0)
    board.swapLeft(2)
    assert.equal(board.blocks[0], 3)
    assert.equal(board.blocks[3], 0)
    board.swapBelow(4)
    assert.equal(board.blocks[0], 3)
    assert.equal(board.blocks[3], 0)
  })
})
