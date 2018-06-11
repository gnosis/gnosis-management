import { createSelector } from 'reselect'
import { getActiveProvider, getCurrentAccount } from 'integrations/store/selectors'
import { badgeOf } from 'routes/Scoreboard/components/Table/ScoreTable/table'

const tournamentUsersSelectorAsList = (state) => {
  if (!state.users) {
    return undefined
  }

  return state.users.toList()
}

export const firstTournamentUsersSelectorAsList = createSelector(
  tournamentUsersSelectorAsList,
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

export const tournamentMainnetRegistryAddress = (state) => {
  const provider = getActiveProvider(state)

  return provider ? provider.mainnetAddress : undefined
}

export const meSelector = createSelector(
  tournamentUsersSelectorAsList,
  getCurrentAccount,
  (users, account) => (users ? users.find(user => user.account === account) : undefined),
)

export const rankSelector = createSelector(meSelector, account => (account ? account.currentRank : undefined))

export const badgeSelector = createSelector(meSelector, account => badgeOf(account ? account.predictions : undefined))
