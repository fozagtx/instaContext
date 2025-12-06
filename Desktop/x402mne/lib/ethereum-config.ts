import { createConfig, http } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import { metaMaskWallet, walletConnectWallet, coinbaseWallet } from '@rainbow-me/rainbowkit/wallets';

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'your-project-id';

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Popular',
      wallets: [metaMaskWallet, walletConnectWallet, coinbaseWallet],
    },
  ],
  {
    appName: 'x402mnee - MNEE Hackathon',
    projectId,
  }
);

export const wagmiConfig = createConfig({
  connectors,
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});

// Network configuration
export const supportedChains = {
  mainnet: {
    id: 1,
    name: 'Ethereum Mainnet',
    rpcUrl: 'https://eth-mainnet.g.alchemy.com/v2/your-api-key',
    explorerUrl: 'https://etherscan.io'
  },
  sepolia: {
    id: 11155111,
    name: 'Sepolia Testnet',
    rpcUrl: 'https://eth-sepolia.g.alchemy.com/v2/your-api-key',
    explorerUrl: 'https://sepolia.etherscan.io'
  }
} as const;

export type SupportedChainId = keyof typeof supportedChains;

// MNEE contract deployment info
export const mneeContractInfo = {
  address: '0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF',
  decimals: 6,
  symbol: 'MNEE',
  name: 'MNEE Token',
  chainId: 1, // Mainnet
} as const;

// Gas configurations for different transaction types
export const gasConfigs = {
  transfer: {
    gasLimit: 65000,
    priority: 'standard' as const
  },
  approve: {
    gasLimit: 50000,
    priority: 'standard' as const
  },
  agentPayment: {
    gasLimit: 80000,
    priority: 'fast' as const
  }
} as const;