import moment from 'moment'
import { List } from 'immutable'
import sha1 from 'sha1'

import { requestFromRestAPI } from 'api/utils/fetch'
import { hexWithoutPrefix } from 'utils/helpers'
import { OutcomeRecord } from 'store/models/market'
import ShareRecord from '../models/share'
import { addShare } from '../actions'

const OUTCOMES_SCALAR = ['short', 'long']

const buildOutcomesFrom = (marginalPrice, selectedOutcomeToken, marketOutcomeLabels) => {
  // no value for eventDescription.outcomes means we have a scalar market
  const outcomeLabels = marketOutcomeLabels || OUTCOMES_SCALAR

  const outcomes = outcomeLabels.map((label, index) =>
    new OutcomeRecord({
      name: label,
      marginalPrice: selectedOutcomeToken.index === index ? marginalPrice : undefined,
      outcomeTokensSold: undefined,
    }))

  return List(outcomes)
}

const extractShare = (payload) => {
  const {
    outcomeToken: selectedOutcomeToken,
    owner,
    balance,
    marginalPrice,
    eventDescription: {
      title: marketTitle,
      description: marketDescription,
      resolutionDate: marketResolution,
      outcomes: marketOutcomeLabels,
    },
  } = payload

  const outcomes = buildOutcomesFrom(marginalPrice, selectedOutcomeToken, marketOutcomeLabels)

  const id = sha1(`${owner}-${selectedOutcomeToken.event}-${selectedOutcomeToken.index}`)

  const record = new ShareRecord({
    id,
    owner,
    balance,
    marketTitle,
    marketDescription,
    marketResolution: moment.utc(marketResolution),
    marketOutcomes: outcomes,
    marginalPrice,
    outcomeToken: outcomes[selectedOutcomeToken.index],
  })

  return record
}

const processSharesResponse = (response, dispatch) => {
  if (response && response.results.length) {
    const shareRecords = response.results.map(extractShare)
    dispatch(addShare(shareRecords))
  }
}

export default account => async (dispatch) => {
  const normalizedAccount = hexWithoutPrefix(account)
  const response = await requestFromRestAPI(`account/${normalizedAccount}/shares`)

  processSharesResponse(response, dispatch)
}
