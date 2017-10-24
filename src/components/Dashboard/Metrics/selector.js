import { createSelector, createStructuredSelector } from 'reselect';
import { getCurrentBalance } from 'selectors/blockchain'
import { meSelector } from 'routes/scoreboard/store/selectors';
import { roundProfits } from 'utils/helpers';
import { badgeOf } from 'routes/scoreboard/components/ScoreTable/table'

const tokenSelector = createSelector(
    getCurrentBalance,
    (balance) => balance ? balance.substring(0,5) : undefined,
)

const profitsSelector = createSelector(
    meSelector,
    account => (account ? roundProfits(account.predictedProfits) : undefined),
)

const rankSelector = createSelector(
    meSelector,
    account => ( account ? account.currentRank : undefined),
)

const badgeSelector = createSelector(
    meSelector,
    account => badgeOf(account ? account.predictions : undefined),
)


export default createStructuredSelector({
    tokens: tokenSelector,
    predictedProfits: profitsSelector,
    rank: rankSelector,
    badge: badgeSelector,
});
