import integrations from 'integrations'
import { initGnosis } from 'store/actions/blockchain'
import { runProviderRegister, runProviderUpdate, updateProvider } from 'integrations/store/actions'
import { getProvider } from 'integrations/store/selectors'
import { getProviderConfig } from 'utils/features'
import { WALLET_STATUS, WALLET_PROVIDER } from 'integrations/constants'
import { openModal, closeModal } from 'store/actions/modal'

const providers = getProviderConfig()

if (!providers.length) {
  console.error(`No providers specified. It means you won't be able to interact with the application.
  You need to configure providers, please check our docs for details: https://gnosis-apollo.readthedocs.io/en/latest/index.html`)
}

export default store => next => async (action) => {
  const { dispatch, getState } = store
  const prevState = getState()
  const handledAction = next(action)
  const { type, payload } = action

  const providerOptions = {
    runProviderUpdate: (provider, data) => dispatch(runProviderUpdate(provider, data)),
    runProviderRegister: (provider, data) => dispatch(runProviderRegister(provider, data)),
    initGnosis: () => dispatch(initGnosis()),
    dispatch,
  }

  if (type === 'CHECK_AVAILABLE_PROVIDERS') {
    const opts = { ...providerOptions, runProviderUpdate: (provider, data) => dispatch(updateProvider(provider, data)) }
    providers.map(provider => integrations[provider].checkAvailability(opts))
  }

  if (type === 'INIT_PROVIDERS') {
    if (payload && payload.provider) {
      integrations[payload.provider].initialize(providerOptions)
    }
  }

  if (type === 'PROVIDER_LOGOUT') {
    Object.keys(integrations).forEach((providerName) => {
      const integration = integrations[providerName]

      if (integration.constructor.providerName === payload) {
        integration.logout()
      }
    })
  }

  if (type === 'UPDATE_PROVIDER') {
    if (payload) {
      const { provider, status } = payload

      if (provider === WALLET_PROVIDER.METAMASK) {
        if (status === WALLET_STATUS.USER_ACTION_REQUIRED) {
          dispatch(openModal({ modalName: 'ModalUnlockMetamask' }))
        }
      }

      if (status === WALLET_STATUS.INITIALIZED) {
        const prevStatus = getProvider(prevState, provider).status

        if (
          prevStatus === WALLET_STATUS.USER_ACTION_REQUIRED
          || prevStatus === WALLET_STATUS.READY_TO_INIT
          || prevStatus === WALLET_STATUS.REGISTERED
        ) {
          dispatch(closeModal())
        }
      }

      if (status === WALLET_STATUS.ERROR) {
        const prevStatus = getProvider(prevState, provider).status

        if (
          prevStatus === WALLET_STATUS.USER_ACTION_REQUIRED
          || prevStatus === WALLET_STATUS.READY_TO_INIT
          || prevStatus === WALLET_STATUS.REGISTERED
        ) {
          dispatch(openModal({ modalName: 'ModalInitialisationError', modalData: { provider } }))
        }
      }
    }
  }

  return handledAction
}
