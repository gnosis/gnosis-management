import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import className from 'classnames/bind'
import OutcomeColorBox from 'components/Outcome/OutcomeColorBox'
import DecimalValue from 'components/DecimalValue'
import CurrencyName from 'components/CurrencyName'
import { weiToEth } from 'utils/helpers'
import { marketRecordShape } from 'utils/shapes'
import { OutcomeRecord } from 'store/models/market'

import style from './style.mod.scss'

const cx = className.bind(style)

const Share = ({
  id, marketTitle, marketType, market, outcomeToken, collateralTokenAddress, balance, marginalPrice,
  redeemWinnings,
}) => {
  const showSellLink = !market.closed && !market.resolved
  const showRedeemLink = market.resolved

  return (
    <div className={cx('share', 'category')}>
      <div className={cx('row')}>
        <Link className={cx('title', 'col-md-12')} to={`/markets/${market.address}`} title={marketTitle}>
          {marketTitle}
        </Link>
      </div>
      <div className={cx('outcome', 'row')}>
        <div className={cx('outcomeBox', 'col-md-3')}>
          <OutcomeColorBox scheme={marketType} outcomeIndex={outcomeToken.index} />&nbsp;
          {outcomeToken.name}
        </div>
        <div className={cx('shareAmount', 'col-md-2')}>
          <DecimalValue value={weiToEth(balance)} />
        </div>
        <div className={cx('sharePrice', 'col-md-3')}>
          <DecimalValue value={marginalPrice} />&nbsp;
          {collateralTokenAddress ? <CurrencyName tokenAddress={collateralTokenAddress} /> : <span>ETH</span> }
        </div>
        <div className={cx('shareAction', 'col-md-4')}>
          {showSellLink && <Link to={`/markets/${market.address}/my-shares/${id}`}>SELL</Link>}
          {showRedeemLink && <button className="btn btn-link" type="button" onClick={() => redeemWinnings(market)}>REDEEM WINNINGS</button>}
        </div>
      </div>
    </div>
  )
}

Share.propTypes = {
  id: PropTypes.string.isRequired,
  marketTitle: PropTypes.string.isRequired,
  marketType: PropTypes.string.isRequired,
  market: marketRecordShape.isRequired,
  balance: PropTypes.string.isRequired,
  marginalPrice: PropTypes.string.isRequired,
  outcomeToken: PropTypes.shape(OutcomeRecord).isRequired,
  collateralTokenAddress: PropTypes.string.isRequired,
  redeemWinnings: PropTypes.func.isRequired,
}

export default Share
