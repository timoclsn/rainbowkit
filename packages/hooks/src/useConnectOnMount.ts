import { useEffect } from 'react'
import { Connector } from '@web3-react/types'
import { isAuthorized } from '@rainbow-me/kit-utils'
import { useWeb3State } from './useWeb3State'

/**
 * A React hook that attempts to connect to a provider if it was initialized before.
 * @param connector web3-react connector
 * @param enabled enable/disable the hook
 * @param storage browser storage to use.
 */
export const useConnectOnMount = (connector: Connector, enabled: boolean, storageProvider?: Storage | false) => {
  const { isConnected } = useWeb3State()

  useEffect(() => {
    const storage = storageProvider === undefined ? localStorage : storageProvider
    let cachedState = true
    if (storage) cachedState = storage.getItem('rk-last-wallet') !== undefined

    isAuthorized().then((yes) => {
      if (cachedState && enabled && !isConnected && window.ethereum && yes) {
        connector.activate()
      }
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageProvider]) // Only trigger on mount

  return isConnected
}
