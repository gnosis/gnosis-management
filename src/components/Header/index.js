import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'
import autobind from 'autobind-decorator'
import { upperFirst } from 'lodash'
import className from 'classnames/bind'
import CurrencyName from 'components/CurrencyName'
import DecimalValue from 'components/DecimalValue'
import { providerPropType } from 'utils/shapes'
import { isFeatureEnabled, getFeatureConfig } from 'utils/features'
import { hasMetamask } from 'integrations/metamask/utils'
import { WALLET_PROVIDER } from 'integrations/constants'

import Identicon from './Identicon'
import ProviderIcon from './ProviderIcon'
import BadgeIcon from './BadgeIcon'
import MenuAccountDropdown from './MenuAccountDropdown'

import css from './Header.mod.scss'

const cx = className.bind(css)

const tournamentEnabled = isFeatureEnabled('tournament')
const badgesEnabled = isFeatureEnabled('badges')
const requireRegistration = isFeatureEnabled('registration')
const providerConfig = getFeatureConfig('providers')
const legalComplianceEnabled = isFeatureEnabled('legalCompliance')
const { default: defaultProvider } = providerConfig

const useMetamask = defaultProvider === WALLET_PROVIDER.METAMASK
const useUport = defaultProvider === WALLET_PROVIDER.UPORT

const BALANCE_FETCH_INTERVAL = 5000

class Header extends Component {
  componentDidMount() {
    const {
      currentAccount, requestMainnetAddress, requestTokenBalance, fetchTournamentUserData,
    } = this.props

    if (requireRegistration && currentAccount) {
      requestMainnetAddress()
    }

    if (currentAccount) {
      this.balanceFetcher = setInterval(() => requestTokenBalance(currentAccount), BALANCE_FETCH_INTERVAL)

      if (tournamentEnabled) {
        fetchTournamentUserData(currentAccount)
      }
    }
  }

  componentDidUpdate(prevProps) {
    const {
      currentAccount, requestTokenBalance, requestMainnetAddress, fetchTournamentUserData,
    } = this.props
    // If user unlocks metamask, changes his account, we need to check if the account was registered
    const shouldRequestMainnetAddress = requireRegistration && currentAccount !== prevProps.currentAccount
    if (shouldRequestMainnetAddress && currentAccount) {
      clearInterval(this.balanceFetcher)
      this.balanceFetcher = setInterval(() => requestTokenBalance(currentAccount), BALANCE_FETCH_INTERVAL)
      requestMainnetAddress()
      fetchTournamentUserData(currentAccount)
    }
  }

  @autobind
  async handleConnectWalletClick() {
    const {
      isConnectedToCorrectNetwork, lockedMetamask, acceptedTOS, openModal, initUport,
    } = this.props

    const shouldInstallProviders = !hasMetamask() && !useUport
    const shouldAcceptTOS = !acceptedTOS || !legalComplianceEnabled

    if (shouldInstallProviders) {
      openModal('ModalInstallMetamask')
    } else if (useMetamask) {
      if (lockedMetamask) {
        openModal('ModalUnlockMetamask')
      } else if (!isConnectedToCorrectNetwork) {
        openModal('ModalSwitchNetwork')
      } else if (requireRegistration) {
        openModal('ModalRegisterWallet')
      } else if (shouldAcceptTOS) {
        openModal('ModalAcceptTOS')
      } else {
        console.warn('should be connected')
      }
    } else if (useUport) {
      initUport()
    }
  }

  render() {
    const {
      version,
      hasWallet,
      currentAccount,
      currentNetwork,
      tokenBalance,
      currentProvider,
      logoPath,
      smallLogoPath,
      showScoreboard,
      showGameGuide,
      gameGuideType,
      gameGuideURL,
      tokenAddress,
      mainnetAddress,
      userTournamentInfo,
      acceptedTOS,
    } = this.props

    let canInteract = (acceptedTOS || !legalComplianceEnabled) && hasWallet && !!currentProvider

    if (tournamentEnabled && useMetamask && requireRegistration) {
      canInteract = hasWallet && !!mainnetAddress
    }

    const logoVars = {}
    if (tournamentEnabled) {
      logoVars['--logoAnnotation'] = "'Powered by Gnosis'"
      logoVars['--logoPath'] = `url("${logoPath}")`
      logoVars['--smallLogoPath'] = `url("${smallLogoPath}")`
    }

    let gameGuideLink = <div />
    if (showGameGuide) {
      if (gameGuideType === 'default') {
        gameGuideLink = (
          <NavLink to="/game-guide" activeClassName={cx('active')} className={cx('navLink')}>
            Game guide
          </NavLink>
        )
      }

      if (gameGuideType === 'link') {
        gameGuideLink = (
          <a href={gameGuideURL} className={cx('navLink')} target="_blank" rel="noopener noreferrer">
            Game Guide
          </a>
        )
      }
    }

    return (
      <div className={cx('headerContainer')}>
        <div className={cx('container', 'containerFlex')}>
          <div className={cx('group', 'logo')}>
            <NavLink to="/markets/list">
              <div className={cx('headerLogo', 'beta')} style={logoVars} />
            </NavLink>
          </div>
          <div className={cx('group', 'left', 'version')}>
            {version}
          </div>
          <div className={cx('group', 'left', 'navLinks')}>
            <NavLink to="/markets/list" activeClassName={cx('active')} className={cx('navLink')}>
              Markets
            </NavLink>
            {canInteract && (
              <NavLink to="/dashboard" activeClassName={cx('active')} className={cx('navLink')}>
                Dashboard
              </NavLink>
            )}
            {showScoreboard && (
              <NavLink to="/scoreboard" activeClassName={cx('active')} className={cx('navLink')}>
                Scoreboard
              </NavLink>
            )}
            {gameGuideLink}
          </div>

          <div className={cx('group', 'right')}>
            {canInteract ? (
              <div className={cx('account')}>
                {currentNetwork
                  && currentNetwork !== 'MAIN' && (
                  <span className={cx('network', 'text')}>
                      Network:
                    {upperFirst(currentNetwork.toLowerCase())}
                  </span>
                )}
                <DecimalValue value={tokenBalance} className={cx('text')} />
                &nbsp;
                {tokenAddress ? <CurrencyName className={cx('text')} tokenAddress={tokenAddress} /> : (
                  <span>
ETH
                  </span>
                )}
                {badgesEnabled && <BadgeIcon userTournamentInfo={userTournamentInfo} />}
                <ProviderIcon provider={currentProvider} />
                <Identicon account={currentAccount} />
                {useUport && <MenuAccountDropdown />}
              </div>
            ) : (
              <button className={cx('connect-wallet')} onClick={this.handleConnectWalletClick}>
                Connect a wallet
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }
}

Header.propTypes = {
  version: PropTypes.string,
  currentNetwork: PropTypes.string,
  hasWallet: PropTypes.bool,
  tokenBalance: PropTypes.string,
  currentProvider: providerPropType,
  currentAccount: PropTypes.string,
  userTournamentInfo: PropTypes.shape({}),
  logoPath: PropTypes.string.isRequired,
  smallLogoPath: PropTypes.string.isRequired,
  showScoreboard: PropTypes.bool,
  showGameGuide: PropTypes.bool,
  gameGuideType: PropTypes.string,
  gameGuideURL: PropTypes.string,
  tokenAddress: PropTypes.string,
  lockedMetamask: PropTypes.bool,
  requestMainnetAddress: PropTypes.func.isRequired,
  requestTokenBalance: PropTypes.func.isRequired,
  mainnetAddress: PropTypes.string,
  initUport: PropTypes.func.isRequired,
  openModal: PropTypes.func.isRequired,
  acceptedTOS: PropTypes.bool,
  fetchTournamentUserData: PropTypes.func.isRequired,
}

Header.defaultProps = {
  version: '',
  currentNetwork: '',
  hasWallet: false,
  tokenBalance: '0',
  currentProvider: {},
  currentAccount: '',
  showScoreboard: false,
  showGameGuide: false,
  gameGuideType: 'default',
  gameGuideURL: '',
  mainnetAddress: undefined,
  lockedMetamask: true,
  userTournamentInfo: undefined,
  tokenAddress: undefined,
  acceptedTOS: false,
}

export default Header
