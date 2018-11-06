import { Map, List, fromJS } from 'immutable'
import { handleActions } from 'redux-actions'
import { normalizeHex } from 'utils/helpers'
import {
  registerProvider,
  updateProvider,
  setActiveProvider,
  saveWalletSetting,
  setLegalDocumentsAccepted,
} from 'integrations/store/actions'
import { ProviderRecord } from 'integrations/store/models'
import { loadStorage } from 'store/middlewares/Storage'

export default handleActions(
  {
    [setActiveProvider]: (state, { payload }) => state.set('activeProvider', payload),
    [registerProvider]: (state, { payload: { provider: name, priority } }) => {
      const newProvider = { name, priority }
      return state.setIn(['providers', name], new ProviderRecord(newProvider))
    },
    [updateProvider]: (state, { payload }) => {
      const { provider: name, ...provider } = payload
      const updatedProvider = { name, ...provider }
      return state.mergeIn(['providers', name], updatedProvider)
    },
    [setLegalDocumentsAccepted]: (state, { payload: docs }) => state.set('documentsAccepted', List(docs)),
    [saveWalletSetting]: (state, { payload: { account, key, value } }) => state.setIn(['accountSettings', normalizeHex(account), key], value),
    [loadStorage]: (state, { payload: { integrations } }) => {
      if (integrations) {
        return state.merge(fromJS(integrations))
      }

      return state
    },
  },
  Map({
    providers: Map(),
    activeProvider: undefined,
    documentsAccepted: List(),
    accountSettings: Map(),
  }),
)
