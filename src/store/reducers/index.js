import { combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'
import { isFeatureEnabled } from 'utils/features'

// Reducers
import integrations from 'integrations/store/reducers'
import users from 'routes/Scoreboard/store/reducers/users'
import transactions from 'routes/Transactions/store/reducers/transactions'
import modal from './modal'
import blockchain from './blockchain'
import notifications from './notifications'
import marketList from './market'
import accountShares from './accountShares'
import accountTrades from './accountTrades'
import interfaceState from './interface'

const tournamentEnabled = isFeatureEnabled('tournament')

const reducers = {
  form: formReducer,
  modal,
  transactions,
  blockchain,
  notifications,
  integrations,
  marketList,
  accountShares,
  accountTrades,
  interfaceState,
}

if (tournamentEnabled) {
  reducers.tournament = combineReducers({
    ranking: users,
  })
}

export default combineReducers(reducers)
