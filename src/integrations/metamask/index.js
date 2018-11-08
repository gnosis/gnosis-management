import { WALLET_PROVIDER } from 'integrations/constants'
import InjectedWeb3 from 'integrations/injectedWeb3'
import { timeoutCondition } from 'utils/helpers'
import { hasMetamask } from 'integrations/metamask/utils'
import Web3 from 'web3'

const NETWORK_TIMEOUT = 10000

class Metamask extends InjectedWeb3 {
  static providerName = WALLET_PROVIDER.METAMASK

  checkIfInstalled() {
    return hasMetamask()
  }

  /**
   * Provider with highest priority starts off as active, if other providers are also available.
   * This allows "fallback providers" like a remote etherium host to be used as a last resort.
   */
  static providerPriority = 90

  static watcherInterval = 1000

  constructor() {
    super()
    this.watcher = () => {
      this.watch('account', this.getAccount)
      this.watch('balance', this.getBalance)
      this.watch('networkId', this.getNetworkId)
    }
  }

  /**
   * Tries to set connection to the blockchain
   */
  async initWeb3() {
    if (hasMetamask()) {
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum)
        try {
          console.log('trying to get account')
          await window.ethereum.enable()
          console.log('getting web3')
          this.web3 = window.web3
          return true
        } catch (error) {
          console.log(error)
          return false
        }
      } else if (window.web3) {
        this.web3 = new Web3(window.web3.currentProvider)
        window.web3 = this.web3
        return true
      }
    }
    return false
  }

  /**
   * Tries to initialize and enable the current provider
   * @param {object} opts - Integration Options
   * @param {function} opts.runProviderUpdate - Function to run when this provider updates
   * @param {function} opts.runProviderRegister - Function to run when this provider registers
   */
  async initialize(opts) {
    super.initialize(opts)
    this.runProviderRegister(this, { priority: Metamask.providerPriority })

    this.walletEnabled = await this.initWeb3()

    if (this.walletEnabled) {
      const checks = async () => {
        this.networkId = await this.getNetworkId()
        this.network = await this.getNetwork()
        this.account = await this.getAccount()
        this.balance = await this.getBalance()
      }

      // allow metamask timeout
      try {
        await Promise.race([checks(), timeoutCondition(NETWORK_TIMEOUT, 'connection timed out')])
      } catch (err) {
        console.warn(err)
        this.walletEnabled = false
      }
    } else {
      throw new Error('Initialization failed')
    }

    if (this.watcher) {
      setInterval(this.watcher, Metamask.watcherInterval)
    }

    this.runProviderUpdate(this, {
      networkId: this.networkId,
      network: this.network,
      account: this.account,
      balance: this.balance,
    })
  }
}

export default new Metamask()
