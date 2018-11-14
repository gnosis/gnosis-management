export const ETHEREUM_NETWORK = {
  MAIN: 'MAIN',
  MORDEN: 'MORDEN',
  ROPSTEN: 'ROPSTEN',
  RINKEBY: 'RINKEBY',
  KOVAN: 'KOVAN',
  UNKNOWN: 'UNKNOWN',
}

export const WALLET_PROVIDER = {
  METAMASK: 'METAMASK',
  PARITY: 'PARITY',
  REMOTE: 'REMOTE',
  UPORT: 'UPORT',
  TRUST: 'TRUST',
  STATUS: 'STATUS',
}

export const ETHEREUM_NETWORK_IDS = {
  1: ETHEREUM_NETWORK.MAIN,
  2: ETHEREUM_NETWORK.MORDEN,
  3: ETHEREUM_NETWORK.ROPSTEN,
  4: ETHEREUM_NETWORK.RINKEBY,
  42: ETHEREUM_NETWORK.KOVAN,
}

export const WALLET_STATUS = {
  REGISTERED: 'REGISTERED',
  INITIALIZED: 'INITALIZED',
  NOT_INSTALLED: 'NOT_INSTALLED',
  READY_TO_INIT: 'READY_TO_INIT',
  ERROR: 'ERROR',
  USER_ACTION_REQUIRED: 'USER_ACTION_REQUIRED',
}
