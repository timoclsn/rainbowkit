import React, { useEffect } from 'react'
import { Web3Provider } from '@ethersproject/providers'
import { useState } from 'react'
import { Modal as ModalUI } from './components/Modal'
import { isAuthorized } from '@rainbow-me/kit-utils'
import { useRainbowKitState } from '@rainbow-me/kit-utils'
import type { Wallet } from '@rainbow-me/kit-utils'
import type { UseWalletModalOptions } from './types'
import { createConnector } from './utils'
import { Actions, Connector } from '@web3-react/types'

export type WalletInterface = {
  connector: Connector
  chainId: number
  error: Error
} & {
  Modal?: () => JSX.Element
  provider: Web3Provider | undefined
  address: string | undefined | null
  state: {
    connect: () => void
    disconnect: () => void
    isConnected: boolean
    isConnecting: boolean
  }
}

export const useWalletModal = ({
  modal: ModalComponent,
  chains = [],
  wallets: selectedWallets,
  terms
}: UseWalletModalOptions): WalletInterface => {
  const {
    connector: { deactivate },
    hooks: { useWeb3React, useProvider }
  } = useRainbowKitState()

  const provider = useProvider()

  const { active: isConnected, account: address, ...web3ReactProps } = useWeb3React(provider)

  const wallets = selectedWallets.map((w) => {
    if (typeof w === 'string') {
      switch (w) {
        case 'metamask':
          return {
            name: w,
            hidden: false,
            options: {},
            iconUrl: '/icons/rainbow.png'
          }
        default:
          return {
            name: w,
            hidden: false,
            options: {}
          }
      }
    }

    return w
  }) as Wallet[]

  const connectToWallet = async (name: string) => {
    const options: Record<string, any> = wallets.find((w) => w.name === name)?.options || {}

    const { instance } = await createConnector({ name: name, chains, options })

    await instance.activate()
  }

  useEffect(() => {
    const walletName = localStorage.getItem('rk-last-wallet')

    if (walletName && !isConnected && window.ethereum && selectedWallets.includes(walletName)) {
      isAuthorized().then((yes) => {
        if (yes) connectToWallet(walletName)
      })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [isConnecting, setConnecting] = useState(false)

  const connect = () => {
    setConnecting(true)
  }

  const activateConnector = async (c: Wallet) => {
    localStorage.setItem('rk-last-wallet', c.connectorName || c.name)
    await connectToWallet(c.connectorName || c.name)
    return setConnecting(false)
  }

  const disconnect = () => {
    localStorage.removeItem('rk-last-wallet')
    deactivate()
  }

  if (typeof ModalComponent === 'undefined') {
    const Modal = () => <ModalUI connect={activateConnector} {...{ wallets, isConnecting, setConnecting, terms }} />

    return { Modal, state: { isConnected, isConnecting, connect, disconnect }, provider, address, ...web3ReactProps }
  } else {
    return { state: { connect, disconnect, isConnected, isConnecting }, provider, address, ...web3ReactProps }
  }
}
