import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { alchemyProvider } from 'wagmi/providers/alchemy';

import { App } from './App';

const networks =
  process.env.NODE_ENV === 'development'
    ? [chain.goerli, chain.polygonMumbai, chain.hardhat]
    : [chain.mainnet, chain.polygon];

const alchemyId = process.env.ALCHEMY_ID;
const providers = alchemyId
  ? [publicProvider(), alchemyProvider({ alchemyId })]
  : [publicProvider()];

const { chains, provider } = configureChains(networks, providers);

const wagmiClient = (name, autoConnect) => {
  const { connectors } = getDefaultWallets({ name, chains });
  return createClient({ autoConnect, connectors, provider });
};

const { backendUrl, name, autoConnect } = require('./config.json');

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <WagmiConfig client={wagmiClient(name, autoConnect)}>
      <RainbowKitProvider chains={chains}>
        <App name={name} backendUrl={backendUrl} />
      </RainbowKitProvider>
    </WagmiConfig>
  </StrictMode>
);
