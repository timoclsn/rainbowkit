import React from 'react'
import { useWalletModal } from '@rainbow-me/kit-modal'
// import { InfuraWebSocketProvider } from '@ethersproject/providers'

// const mainnetProvider = new InfuraWebSocketProvider('homestead', '372913dfd3114b34983d2256c46195a7')

const About = () => {
  const {
    state: { connect }
  } = useWalletModal({
    chains: ['mainnet', 'polygon', 'optimism', 'arbitrum', 'kovan', 'ropsten'],
    wallets: ['metamask']
  })

  return <button onClick={() => connect()}></button>
}

export default About
