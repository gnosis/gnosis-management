const config = window.GNOSIS_CONFIG
const configInterface = window.GNOSIS_INTERFACE

export const getConfiguration = () => config
export const getInterfaceConfiguration = () => configInterface

export const getLogoConfig = () => configInterface.logo

export const isFeatureEnabled = feature => configInterface[feature] && configInterface[feature].enabled

export const getFeatureConfig = feature => configInterface[feature] && configInterface[feature]

export const getCollateralToken = () => configInterface.collateralToken

export const getProviderConfig = () => configInterface.providers

export const getProviderIntegrationConfig = providerName =>
  configInterface.providers.options[providerName.toUpperCase()]
