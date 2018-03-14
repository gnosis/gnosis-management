import { createSelector } from 'reselect'
import { getActiveProvider, getCurrentAccount } from 'integrations/store/selectors'

const olympiaUsersSelectorAsList = (state) => {
  if (!state.olympia) {
    return undefined
  }

  if (!state.olympia.ranking) {
    return undefined
  }

  return state.olympia.ranking.toList()
}

export const firstOlympiaUsersSelectorAsList = createSelector(
  olympiaUsersSelectorAsList,
  users =>
    (users
      ? users
        .filter(user => user.currentRank > 0)
        .sort((userA, userB) => {
          if (userA.currentRank > userB.currentRank) {
            return 1
          }

          if (userA.currentRank < userB.currentRank) {
            return -1
          }

          return 0
        })
        .take(100)
      : undefined),
)

export const olympiaMainnetRegistryAddress = (state) => {
  const provider = getActiveProvider(state)

  return provider ? provider.mainnetAddress : undefined
}

export const meSelector = createSelector(
  olympiaUsersSelectorAsList,
  getCurrentAccount,
  (users, account) => (users ? users.find(user => user.account === account) : undefined),
)
