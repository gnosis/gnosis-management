import { connect } from 'react-redux'
import { openModal } from 'actions/modal'

import Header from 'components/Header'

import {
  getCurrentBalance,
  getCurrentNetwork,
  getCurrentAccount,
  getSelectedProvider,
  checkWalletConnection,
  isConnectedToCorrectNetwork,
} from 'selectors/blockchain'

const mapStateToProps = state => ({
  hasWallet: checkWalletConnection(state),
  currentAccount: getCurrentAccount(state),
  currentBalance: getCurrentBalance(state),
  currentNetwork: getCurrentNetwork(state),
  currentProvider: getSelectedProvider(state),
  isConnectedToCorrectNetwork: isConnectedToCorrectNetwork(state),
})

const mapDispatchToProps = dispatch => ({
  openInstallMetamaskModal: () => dispatch(openModal({ modalName: 'ModalInstallMetamask' })),
  openAcceptTOSModal: () => dispatch(openModal({ modalName: 'ModalAcceptTOS' })),
  openNetworkCheckModal: () => dispatch(openModal({ modalName: 'ModalNetworkCheck' })),
})

export default connect(mapStateToProps, mapDispatchToProps)(Header)
