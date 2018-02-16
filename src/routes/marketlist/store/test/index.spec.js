import marketReducerTests from './market.reducer.spec'
import marketTests from './market.selector.spec'
import openMarketTests from './openMarkets.selector.spec'

describe('Market List Test suite', () => {
  // ACTIONS AND REDUCERS
  marketReducerTests()

  // SELECTORS
  marketTests()
  openMarketTests()
})
