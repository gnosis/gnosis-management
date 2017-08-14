import React, { Component } from 'react'
import Decimal from 'decimal.js'

// import { calcLMSRMarginalPrice, calcLMSROutcomeTokenCount } from 'api'

import DecimalValue from 'components/DecimalValue'
import CurrencyName, { collateralTokenToText } from 'components/CurrencyName'
import { COLOR_SCHEME_DEFAULT } from 'utils/constants'

import './marketMyTrades.less'

class MarketMyTrades extends Component {

  componentWillMount() {
    const { market, defaultAccount } = this.props    
    if (!this.props.trades || this.props.trades.length == 0) {
      // Retrieve participant trades to state
      this.props.fetchMarketParticipantTrades(market.address, defaultAccount)
    }    
  }

  getAverageCost(order) {
    if (order.orderType == 'BUY') {
      return order.cost/1e18
    }
    else if (order.orderType == 'SELL') {
      return order.profit/1e18
    }
    else if (order.orderType == 'SHORT SELL') {
      return order.cost/1e18
    }    
  }

  renderTrades() {
    const { market, trades } = this.props    
    console.log(trades)
    const tableRowElements = trades.map((trade) => {
      return (
        <tr className="marketMyTrades__share" key={trade['_id']}>
          <td>
            <div
              className={'shareOutcome__color'} style={{ backgroundColor: COLOR_SCHEME_DEFAULT[trade.outcomeToken.index] }}
            />
          </td>          
          <td>
            {trade.orderType}
          </td>
          <td>
            {market.eventDescription.outcomes[trade.outcomeToken.index]}
          </td>
          <td>
            {trade.outcomeTokenCount}
          </td>
          <td>
            {this.getAverageCost(trade)}
          </td>
          <td>
            {trade.date}
          </td>
        </tr>
      )
    })

    return tableRowElements
  }

  render() {
    const { marketShares, market, trades } = this.props
    if (trades.length > 0) {
      return (
        <div className="marketMyTrades">
          <h2 className="marketMyTrades__heading">My Trades</h2>
          <table className="table marketMyTrades__shareTable">
            <thead>
              <tr>
                <th className="marketMyTrades__tableHeading marketMyTrades__tableHeading--index" />
                <th className="marketMyTrades__tableHeading">Order Type</th>
                <th className="marketMyTrades__tableHeading">Outcome</th>
                <th className="marketMyTrades__tableHeading">Outcome token count</th>
                <th className="marketMyTrades__tableHeading">Avg. Price</th>
                <th className="marketMyTrades__tableHeading">Date</th>
              </tr>
            </thead>
            <tbody>
              {this.renderTrades()}
            </tbody>
          </table>
        </div>
      )
    }
    else {
      return (
        <div className="marketMyTrades">
          <h2 className="marketMyTrades__heading">You haven't interacted with this market yet.</h2>
          <h3 className="marketMyTrades">Every transaction that happens on this market will be shown here.</h3>
        </div>
      )
    }
  }
}

export default MarketMyTrades
