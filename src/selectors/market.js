import Decimal from 'decimal.js'
import { isMarketResolved, isMarketClosed, isModerator } from 'utils/helpers'
import { entitySelector } from 'selectors/entities'
import { getEventByAddress } from 'selectors/event'
import { getOracleByAddress } from 'selectors/oracle'
import { getEventDescriptionByAddress } from 'selectors/eventDescription'

export const getMarketById = state => (marketAddress) => {
  const marketEntities = entitySelector(state, 'markets')

  let market = {}
  if (marketEntities[marketAddress]) {
    const marketEntity = marketEntities[marketAddress]

    const marketEvent = getEventByAddress(state)(marketEntity.event)

    if (!marketEvent) {
      return market
    }

    const eventOracle = getOracleByAddress(state)(marketEvent.oracle)

    if (!eventOracle) {
      return market
    }

    const oracleEventDescription = getEventDescriptionByAddress(state)(eventOracle.eventDescription)

    if (!oracleEventDescription) {
      return market
    }

    market = {
      ...marketEntities[marketAddress],
      event: marketEvent,
      oracle: eventOracle,
      eventDescription: oracleEventDescription,
    }
  }

  return market
}

export const getMarkets = (state) => {
  const marketEntities = entitySelector(state, 'markets')

  return Object.keys(marketEntities).map(getMarketById(state))
}

export const filterMarkets = state => (opts) => {
  const marketEntities = getMarkets(state)

  const {
    textSearch, resolved, onlyMyMarkets, onlyModeratorsMarkets, defaultAccount,
  } = opts

  return marketEntities.filter(market =>
    (!textSearch ||
        market.eventDescription.title.toLowerCase().indexOf(textSearch.toLowerCase()) > -1 ||
        market.eventDescription.title.toLowerCase().indexOf(textSearch.toLowerCase()) > -1) &&
      (!onlyMyMarkets || market.creator === defaultAccount.toLowerCase()) &&
      (!onlyModeratorsMarkets || isModerator(market.creator) !== undefined) &&
      (typeof resolved === 'undefined' ||
        (resolved === 'RESOLVED' && (isMarketResolved(market) || isMarketClosed(market))) ||
        (resolved === 'UNRESOLVED' && !isMarketResolved(market) && !isMarketClosed(market))))
}

/**
 * Sorts markets collection
 * @param {*} markets, array of market objects
 * @param {*} orderBy, orderBy criteria
 */
export const sortMarkets = (markets = [], orderBy = null) => {
  switch (orderBy) {
  case 'RESOLUTION_DATE_ASC':
    return markets.sort((a, b) =>
      new Date(a.eventDescription.resolutionDate) - new Date(b.eventDescription.resolutionDate))
  case 'RESOLUTION_DATE_DESC':
    return markets.sort((a, b) =>
      new Date(b.eventDescription.resolutionDate) - new Date(a.eventDescription.resolutionDate))
  case 'TRADING_VOLUME_DESC':
    return markets.sort((a, b) => {
      const tradingA = Decimal(a.tradingVolume)
        .div(1e18)
        .toDP(2, 1)
      const tradingB = Decimal(b.tradingVolume)
        .div(1e18)
        .toDP(2, 1)

      return tradingB.comparedTo(tradingA)
    })
  case 'TRADING_VOLUME_ASC':
    return markets.sort((a, b) => {
      const tradingA = Decimal(a.tradingVolume)
        .div(1e18)
        .toDP(2, 1)
      const tradingB = Decimal(b.tradingVolume)
        .div(1e18)
        .toDP(2, 1)

      return tradingA.comparedTo(tradingB)
    })
  default: {
    const openMarketsSorted = markets
      .filter(market => !isMarketClosed(market) && !isMarketResolved(market))
      .sort((a, b) => new Date(b.creationDate) - new Date(a.creationDate))
    const endedMarkets = markets.filter(market => isMarketClosed(market) || isMarketResolved(market))
    return [...openMarketsSorted, ...endedMarkets]
  }
  }
}

