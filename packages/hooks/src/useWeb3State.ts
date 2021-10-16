import { useRainbowKitState } from '@rainbow-me/kit-utils'
import { Web3Provider } from '@ethersproject/providers'

export const useWeb3State = () => {
  const {
    hooks: { useWeb3React, useProvider }
  } = useRainbowKitState()

  const provider = useProvider()

  const { account: address, active: isConnected, ...web3Props } = useWeb3React(provider)

  return { address, provider, isConnected, ...web3Props }
}
