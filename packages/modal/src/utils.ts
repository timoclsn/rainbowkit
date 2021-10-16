import { Wallet } from '@rainbow-me/kit-utils'
import { connectorByWallet } from '@rainbow-me/kit-utils'
import { initializeConnector } from '@web3-react/core'
import type { Connector as ConnectorType, Actions } from '@web3-react/types'
import assert from 'assert'

/**
 *
 * @param mod in PascalCase
 * @returns
 */
export const importConnector = async (
  mod: string
): Promise<new (actions: Actions, options?: Record<string, any>) => ConnectorType> => {
  const x = await import(`@web3-react/${mod.toLowerCase()}/dist/index.js`)

  return x[mod]
}

/**
 * Imports and creates a connector with given options
 */
export const createConnector = async ({
  name,
  options,
  chains,
  connectorName
}: Wallet & { chains?: (string | number)[] }) => {
  connectorName = connectorName || connectorByWallet(name)

  assert.notEqual(connectorName, undefined, `Could not find connector for ${name}`)

  const Connector = await importConnector(connectorName)

  const [instance] = initializeConnector((actions) => new Connector(actions, options))

  return { instance, name }
}
