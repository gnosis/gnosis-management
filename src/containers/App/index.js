import React from 'react'
import { withRouter } from 'react-router-dom'
import cn from 'classnames/bind'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import TransitionGroup from 'react-transition-group/TransitionGroup'
import CSSTransition from 'react-transition-group/CSSTransition'

import IndefiniteSpinner from 'components/Spinner/Indefinite'
import Footer from 'components/Footer'
import CookieBannerContainer from 'containers/CookieBannerContainer'
import { providerPropType } from 'utils/shapes'
import { getHtmlConfig, isFeatureEnabled } from 'utils/features'
import HeaderContainer from 'containers/HeaderContainer'
import TransactionFloaterContainer from 'containers/TransactionFloaterContainer'
import { isConnectedToBlockchain } from 'store/selectors/blockchain'
import { getActiveProvider, isConnectedToCorrectNetwork } from 'integrations/store/selectors'
import 'normalize.css'

import { lifecycle } from 'recompose'
import style from './app.scss'
import transitionStyles from './transitions.scss'
import 'rc-tooltip/assets/bootstrap.css?raw'

if (isFeatureEnabled('tournament')) {
  import('react-table/react-table.css?raw')
}

const cx = cn.bind(style)

const App = (props) => {
  const {
    provider, blockchainConnection, children, location,
  } = props
  if (!blockchainConnection) {
    return (
      <div className={cx('appContainer')}>
        <div className={cx('loader-container')}>
          <IndefiniteSpinner width={100} height={100} />
          <h1>Connecting to the blockchain</h1>
        </div>
      </div>
    )
  }

  const timeout = { enter: 300, exit: 300 }
  const transitionClassNames = {
    enter: transitionStyles.enter,
    enterActive: transitionStyles.enterActive,
    exit: transitionStyles.exit,
    exitActive: transitionStyles.exitActive,
  }

  return (
    <div className={cx('appContainer')}>
      {isFeatureEnabled('cookieBanner') && <CookieBannerContainer />}
      <HeaderContainer version={process.env.VERSION} />
      {provider && provider.account && <TransactionFloaterContainer />}
      <TransitionGroup>
        <CSSTransition key={location.pathname.split('/')[1]} classNames={transitionClassNames} timeout={timeout}>
          {children}
        </CSSTransition>
      </TransitionGroup>
      <Footer />
    </div>
  )
}

App.propTypes = {
  blockchainConnection: PropTypes.bool,
  children: PropTypes.node,
  location: PropTypes.shape({
    key: PropTypes.string,
    hash: PropTypes.string,
    pathname: PropTypes.string,
    search: PropTypes.string,
  }),
  provider: providerPropType,
}

App.defaultProps = {
  blockchainConnection: false,
  children: <div />,
  location: {},
  provider: {},
}

const mapStateToProps = state => ({
  provider: getActiveProvider(state),
  blockchainConnection: isConnectedToBlockchain(state),
  isConnectedToCorrectNetwork: isConnectedToCorrectNetwork(state),
})

export default withRouter(
  connect(mapStateToProps)(
    lifecycle({
      componentDidMount() {
        document.title = getHtmlConfig().title || 'Gnosis Trading Interface'
      },
    })(App),
  ),
)
