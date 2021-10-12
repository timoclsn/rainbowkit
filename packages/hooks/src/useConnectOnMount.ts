import { useEffect, useMemo, useRef, useState } from 'react'
import { useActivating, useProvider } from '@web3-react/core'
import { isAuthorized } from '@rainbowkit/utils'
import { Connector } from '@web3-react/types'

/**
 * A React hook that attempts to connect to a provider if it was initialized before.
 * @param connector web3-react connector
 * @param enabled enable/disable the hook
 * @param storage browser storage to use.
 */
export const useConnectOnMount = (
  connector: Connector,
  useConnector: any,
  enabled: boolean,
  storageProvider?: Storage | false
) => {
  const activating = useActivating(useConnector)

  const [active, set] = useState(false)

  useEffect(() => {
    const storage = storageProvider === undefined ? localStorage : storageProvider
    let cachedState = true
    if (storage) cachedState = storage.getItem('rk-last-wallet') !== undefined

    isAuthorized().then((yes) => {
      const isNotConnected = cachedState && enabled && !activating && window.ethereum && yes

      if (isNotConnected) {
        connector.activate()
        set(true)
      }
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageProvider]) // Only trigger on mount

  return
}
