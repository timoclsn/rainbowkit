import createContext from 'zustand/context'
import type { Web3ReactHooks } from '@web3-react/core'
import type { Connector } from '@web3-react/types'

const { Provider, useStore } = createContext<{ connector: Connector; hooks: Web3ReactHooks }>()

const RainbowKitProvider = Provider
const useRainbowKitState = useStore

export { RainbowKitProvider, useRainbowKitState }
