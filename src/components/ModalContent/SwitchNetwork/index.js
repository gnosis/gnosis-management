import React from 'react'
import PropTypes from 'prop-types'
import MetamaskIcon from 'assets/img/icons/icon_metamask_color.svg'
import cn from 'classnames/bind'
import { getTournamentName } from 'utils/configuration'
import style from './SwitchNetwork.mod.scss'

const cx = cn.bind(style)

const logoStyle = {
  width: 100,
  height: 100,
}

const tournamentName = getTournamentName()

const SwitchNetwork = ({ closeModal, targetNetwork }) => (
  <div className={cx('switchNetwork')}>
    <button className={cx('closeButton')} onClick={() => closeModal()} />
    <img src={MetamaskIcon} alt="logo" style={logoStyle} />
    <h3 className={cx('heading')}>Switch to the {targetNetwork} Network</h3>
    <p className={cx('text')}>
      Your provider is not currently set to the Rinkeby network. Please switch to Rinkeby and make sure your wallet is
      unlocked to start using {tournamentName}.
    </p>
  </div>
)

SwitchNetwork.propTypes = {
  closeModal: PropTypes.func.isRequired,
  targetNetwork: PropTypes.string.isRequired,
}

export default SwitchNetwork
