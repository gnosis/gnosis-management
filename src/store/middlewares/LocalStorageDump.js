import { set } from 'lodash'
import { isFeatureEnabled } from 'utils/features'

import { LOAD_LOCALSTORAGE } from './LocalStorageLoad'
import { LOAD_SESSIONSTORAGE } from './SessionStorageLoad'

const CLEAR_LOCAL_STORAGE = 'CLEAR_LOCAL_STORAGE'

const INIT = 'INIT'
const forbiddenActions = [INIT, CLEAR_LOCAL_STORAGE, LOAD_LOCALSTORAGE, LOAD_SESSIONSTORAGE]

const PERSIST_PATHS = ['transactions']

export default store => next => (action) => {
  const state = store.getState()

  if (forbiddenActions.indexOf(action.type) === -1) {
    const storage = {}

    PERSIST_PATHS.forEach((path) => {
      storage[path] = { ...state[path].toJS() }
    })

    // FIX-ME: Temporary to remember ToS Acceptance
    const tosAccepted = state.integrations.get('documentsAccepted').toJS()
    set(storage, 'integrations.documentsAccepted', tosAccepted)

    if (isFeatureEnabled('rewards')) {
      set(storage, 'tournament.rewards.rewardsClaimed', state.tournament.rewards.get('rewardsClaimed'))
    }

    // eslint-disable-next-line no-undef
    window.localStorage.setItem(`GNOSIS_${process.env.VERSION}`, JSON.stringify(storage))

    return next(action)
  }
  next(action)
  return null
}
