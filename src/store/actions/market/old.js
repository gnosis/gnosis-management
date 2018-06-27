import uuid from 'uuid/v4'
import * as api from 'api'

import { receiveEntities, updateEntity } from 'store/actions/entities'
import { closeModal } from 'store/actions/modal'
import { requestCollateralTokenBalance } from 'store/actions/blockchain'
import { startLog, closeLog, closeEntrySuccess, closeEntryError } from 'routes/Transactions/store/actions/transactions'

import { TRANSACTION_COMPLETE_STATUS, TRANSACTION_STATUS } from 'utils/constants'

import { getRedeemedShares } from 'store/selectors/marketShares'
import { getCollateralToken } from 'store/selectors/blockchain'

/**
 * Constant names for marketcreation stages
 * @readonly
 * @enum {string}
 */
const TRANSACTION_STAGES = {
  EVENT_DESCRIPTION: 'eventDescription',
  ORACLE: 'oracle',
  EVENT: 'event',
  MARKET: 'market',
  FUNDING: 'funding',
  // Others
  GENERIC: 'generic',
}

/**
 * Generic Stage for single-event transactions
 */
const TRANSACTION_EVENTS_GENERIC = [
  {
    event: TRANSACTION_STAGES.GENERIC,
    label: 'Sending Transaction',
    status: TRANSACTION_STATUS.RUNNING,
  },
]

/**
 * Requests all markets from GnosisDB.
 */
export const requestMarkets = () => async (dispatch) => {
  const payload = await api.requestMarkets()
  return dispatch(receiveEntities(payload))
}

/**
 * Dispatches the shares for the given account address
 * @param {String} accountAddress
 */
export const requestAccountShares = accountAddress => async (dispatch, getState) => {
  const { address: collateralTokenAddress } = getCollateralToken(getState())
  const payload = await api.requestAccountShares(accountAddress, collateralTokenAddress)
  return dispatch(receiveEntities(payload))
}

/**
 * Dispatches the trades for the given account address
 * @param {String} accountAddress
 */
export const requestAccountTrades = accountAddress => async (dispatch, getState) => {
  const { address: collateralTokenAddress } = getCollateralToken(getState())
  const payload = await api.requestAccountTrades(accountAddress, collateralTokenAddress)
  return dispatch(receiveEntities(payload))
}

/**
 * Redeem winnings of a market
 * @param {Market} market - Market to redeem winnings of
 */
export const redeemWinnings = market => async (dispatch, getState) => {
  const transactionId = uuid()
  const state = getState()
  const redeemedShares = getRedeemedShares(state, market.address)
  const currentAccount = await api.getCurrentAccount()

  // Start a new transaction log
  await dispatch(startLog(transactionId, TRANSACTION_EVENTS_GENERIC, `Redeeming Winnings for  "${market.eventDescription.title}"`))

  // const marketType = market.event.type
  // const transactions = marketType === OUTCOME_TYPES.CATEGORICAL ? [REVOKE_TOKENS] : [REVOKE_TOKENS, REVOKE_TOKENS]

  try {
    console.warn('winnings: ', await api.redeemWinnings(market.event.type, market.event.address))
    await dispatch(closeEntrySuccess(transactionId, TRANSACTION_STAGES.GENERIC))

    Object.keys(redeemedShares).forEach(shareId =>
      dispatch(updateEntity({ entityType: 'marketShares', data: { id: shareId, balance: '0' } })))
  } catch (e) {
    console.error(e)
    await dispatch(closeEntryError(transactionId, TRANSACTION_STAGES.GENERIC, e))
    await dispatch(closeLog(transactionId, TRANSACTION_COMPLETE_STATUS.ERROR))

    throw e
  }

  await dispatch(closeLog(transactionId, TRANSACTION_COMPLETE_STATUS.NO_ERROR))
  await dispatch(requestCollateralTokenBalance(currentAccount))
  dispatch(closeModal())
}
