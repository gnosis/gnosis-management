import { pick } from 'lodash'

const CLEAR_LOCAL_STORAGE = 'CLEAR_LOCAL_STORAGE'
const INIT = 'INIT'

const PERSIST_PATHS = ['transactions.log']

export default store => next => (action) => {
  const state = store.getState()
  if (action.type !== CLEAR_LOCAL_STORAGE && action.type !== INIT) {
    let storage = {}

    PERSIST_PATHS.forEach((path) => {
      storage = {
        ...pick(state, path),
      }
    })

    // eslint-disable-next-line no-undef
    window.localStorage.setItem(`GNOSIS_${process.env.VERSION}`, JSON.stringify(storage))

    return next(action)
  }
  next(action)
  return null
}
