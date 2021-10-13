import { useEffect, useState } from 'react'
import { useProvider, useAccount, useChainId, useError } from '@web3-react/core'
import { useConnectOnMount } from './useConnectOnMount'
import { Connector } from '@web3-react/types'
import { walletByConnector } from '@rainbow-me/kit-utils'
/**
 * A React hook for using individual connectors from web3-react.
 * @param connector web3-react connector
 * @param connectOnMount enable/disable connecting on mount
 * @param storageProvider browser storage (`localStorage`, `sessionStorage` etc)
 */
export function useConnector<T extends Connector = Connector>(
  connector: T,
  _useConnector: any,
  connectOnMount = true,
  storageProvider?: Storage
) {
  const [storage, setStorage] = useState<Storage>()

  const provider = useProvider(connector, _useConnector)
  const address = useAccount(_useConnector)
  const chainId = useChainId(_useConnector)
  const error = useError(useConnector)

  useEffect(() => {
    if (connectOnMount) {
      setStorage(storageProvider || localStorage)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const disconnect = () => {
    if (connectOnMount) storage.removeItem('rk-last-wallet')
    return connector.deactivate()
  }

  useConnectOnMount(connector, _useConnector, connectOnMount, storage)

  const connect = async () => {
    if (connectOnMount) localStorage.setItem('rk-last-wallet', walletByConnector(connector.constructor.name))
    return await connector.activate()
  }

  return { provider, connect, isConnected, disconnect, chainId, connector: connector as T, address, error }
}

export type SharedConnectorOptions = Partial<{
  connectOnMount: boolean
  storageProvider: Storage
}>

export type ConnectorContext = ReturnType<typeof useConnector>
