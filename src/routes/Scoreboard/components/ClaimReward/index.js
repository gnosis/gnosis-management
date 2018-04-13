import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames/bind'
import Block from 'components/layout/Block'
import Span from 'components/layout/Span'
import Countdown from 'components/Countdown'
import Paragraph from 'components/layout/Paragraph'
import { getRewardClaimOptions } from 'utils/configuration'
import style from './ClaimReward.mod.scss'

const { claimUntil } = getRewardClaimOptions()
const claimUntilFormat = 'y[Y] M[M] D[d] h[h] m[m]'
const rewardsClaimed = window ? window.localStorage.getItem('rewardsClaimed') === 'true' : false
const cx = cn.bind(style)

const ClaimReward = ({ openClaimRewardModal }) => (
  <Block className={cx('claimReward')}>
    <Block className={cx('rewardInfoContainer')}>
      <Block className={cx('rewardAmount')}>
        <Span className={cx('infoText', 'amount')}>{rewardsClaimed ? 'N/A' : '0.2 GNO'}</Span>
        <Paragraph className={cx('annotation')}>CLAIMABLE GNO</Paragraph>
      </Block>
      <Block className={cx('timeToClaim')}>
        {rewardsClaimed ? (
          <span className={cx('infoText')}>N/A</span>
        ) : (
          <Countdown className={cx('infoText')} target={claimUntil} format={claimUntilFormat} />
        )}
        <Paragraph className={cx('annotation')}>TIME LEFT TO CLAIM</Paragraph>
      </Block>
    </Block>
    <button className={cx('claimButton')} onClick={openClaimRewardModal} disabled={rewardsClaimed}>
      CLAIM NOW
    </button>
  </Block>
)

ClaimReward.propTypes = {
  openClaimRewardModal: PropTypes.func.isRequired,
}

export default ClaimReward
