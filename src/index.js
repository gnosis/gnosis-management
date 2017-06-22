import 'babel-polyfill'
import 'whatwg-fetch'

import React from 'react'

import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { Router, Route, IndexRedirect, hashHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'

import * as walletIntegrations from 'integrations'

import App from 'containers/App'
import MarketListPage from 'containers/MarketListPage'
import MarketDetailPage from 'containers/MarketDetailPage'
import TransactionsPage from 'containers/TransactionsPage'
import AccountPage from 'containers/AccountPage'
import SettingsPage from 'containers/SettingsPage'
import DashboardPage from 'containers/DashboardPage'
import WalletIntegrationProvider from 'containers/WalletIntegrationProvider'

import 'less/style.less'

import store from './store'

// load data from localstorage
store.dispatch({ type: 'INIT' })

/* global document */
const rootElement = document.getElementById('root')

const history = syncHistoryWithStore(hashHistory, store)

// TODO: refactor: https://github.com/reactjs/redux/issues/227
// history.listen(location => store.dispatch(changeLocation(location)))

render(
  <Provider store={store}>
    <WalletIntegrationProvider store={store} integrations={walletIntegrations}>
      <Router history={history}>
        <Route path="/" component={App}>
          <IndexRedirect to="dashboard" />
          <Route path="dashboard" component={DashboardPage} />
          <Route path="transactions" component={TransactionsPage} />
          <Route path="account" component={AccountPage} />
          <Route path="settings" component={SettingsPage} />
          <Route path="markets">
            <IndexRedirect to="list" />
            <Route path="list" component={MarketListPage} />
            <Route path=":id" component={MarketDetailPage} />
          </Route>
        </Route>
      </Router>
    </WalletIntegrationProvider>
  </Provider>,
  rootElement,
)
