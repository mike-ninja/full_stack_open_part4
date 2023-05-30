const listHelper = require('../utils/list_helper')

describe('', () => {
  test('of empty list is null', () => {
    const result = listHelper.favoriteBlog([])

    expect(result).toEqual(null)
  })
})

