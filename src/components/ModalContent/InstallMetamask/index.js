import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames/bind'
import MetamaskIcon from 'assets/img/icons/icon_metamask_color.svg'
import { getFeatureConfig } from 'utils/features'
import css from './InstallMetamask.mod.scss'

const cx = cn.bind(css)

const logoStyle = {
  width: 100,
  height: 100,
}

const { name = 'the application' } = getFeatureConfig('tournament')

const InstallMetamask = ({ closeModal }) => (
  <div className={cx('installMetamask')}>
    <button className={cx('closeButton')} onClick={() => closeModal()} />
    <img src={MetamaskIcon} alt="logo" style={logoStyle} />
    <h3 className={cx('installText')}>Install MetaMask</h3>
    <p className={cx('downloadText')}>
      Metamask is not currently installed or detected.{' '}
      <a className={cx('downloadLink')} href="https://metamask.io/" target="_blank" rel="noopener noreferrer">
        Please download and install MetaMask
      </a>{' '}
      to start using {name}.
    </p>
  </div>
)

InstallMetamask.propTypes = {
  closeModal: PropTypes.func.isRequired,
}

export default InstallMetamask
