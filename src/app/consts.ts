import dotenv from "dotenv";
dotenv.config();

export enum NetworkUsed {
  Mainnet = "mainnet",
  Testnet = "testnet",
  NakamotoTestnet = "nakamotoTestnet",
  Devnet = "devnet",
}
declare const StacksNetworks: readonly [
  "mainnet",
  "testnet",
  "devnet",
  "mocknet"
];
type StacksNetworkName = (typeof StacksNetworks)[number];

export enum BitcoinNetworkName {
  Mainnet = "mainnet",
  Testnet = "testnet",
}

export const NETWORK: NetworkUsed =
  (process.env.NETWORK as NetworkUsed) || "devnet";

// Function to map NetworkUsed to StacksNetworkName
const getStacksNetworkName = (network: NetworkUsed): StacksNetworkName => {
  switch (network) {
    case NetworkUsed.Mainnet:
      return "mainnet";
    case NetworkUsed.Devnet:
      return "devnet";
    case NetworkUsed.NakamotoTestnet:
    case NetworkUsed.Testnet:
    default:
      return "testnet";
  }
};

const getBitcoinNetworkName = (network: NetworkUsed): BitcoinNetworkName => {
  switch (network) {
    case NetworkUsed.Mainnet:
      return BitcoinNetworkName.Mainnet;
    case NetworkUsed.Devnet:
    case NetworkUsed.NakamotoTestnet:
    case NetworkUsed.Testnet:
    default:
      return BitcoinNetworkName.Testnet;
  }
};

export const STACKS_NETWORK_NAME: StacksNetworkName =
  getStacksNetworkName(NETWORK);

export const BITCOIN_NETWORK_NAME: BitcoinNetworkName =
  getBitcoinNetworkName(NETWORK);

const API_CONFIG = {
  [NetworkUsed.Mainnet]: {
    API_URL: "https://api.mainnet.hiro.so/extended/v1/tx/events",
    POX_INFO_URL: "https://api.mainnet.hiro.so/v2/pox",
    REWARD_INDEXES_API_URL:
      "https://api.mainnet.hiro.so/v2/map_entry/SP000000000000000000002Q6VF78/pox-4/reward-cycle-pox-address-list",
    GET_TRANSACTION_EXPLORER_URL(txid: string): string {
      return `https://explorer.hiro.so/txid/${txid}?chain=mainnet`;
    },
    GET_BITCOIN_ADDRESS_EXPLORER_URL(address: string): string {
      return `https://mempool.space/address/${address}`;
    },
    GET_STACKS_ADDRESS_EXPLORER_URL(address: string): string {
      return `https://explorer.hiro.so/address/${address}?chain=mainnet`;
    },
    POX_CONTRACT_ADDRESS: "SP000000000000000000002Q6VF78.pox-4",
    POOL_OPERATOR: process.env.POOL_OPERATOR,
    // POOL_OPERATOR: 'SP2TXK60BBCSNDE1GNNMHM89KY6ZY4ZHTBTJP8X9V',
    POOL_BTC_ADDRESS: process.env.POOL_BTC_ADDRESS,
    POOL_PRIVATE_KEY: process.env.POOL_PRIVATE_KEY,
    SIGNER_PRIVATE_KEY: process.env.SIGNER_PRIVATE_KEY,
    DATABASE_PATH: "src/database/mainnet-pox-events.db",
    FIRST_POX_4_CYCLE: 84,
  },
  [NetworkUsed.Testnet]: {
    API_URL: "https://api.testnet.hiro.so/extended/v1/tx/events",
    POX_INFO_URL: "https://api.testnet.hiro.so/v2/pox",
    REWARD_INDEXES_API_URL:
      "https://api.testnet.hiro.so/v2/map_entry/ST000000000000000000002AMW42H/pox-4/reward-cycle-pox-address-list",
    GET_TRANSACTION_EXPLORER_URL(txid: string): string {
      return `https://explorer.hiro.so/txid/${txid}?chain=testnet`;
    },
    GET_BITCOIN_ADDRESS_EXPLORER_URL(address: string): string {
      return `https://mempool.space/testnet/address/${address}`;
    },
    GET_STACKS_ADDRESS_EXPLORER_URL(address: string): string {
      return `https://explorer.hiro.so/address/${address}?chain=testnet`;
    },
    POX_CONTRACT_ADDRESS: "ST000000000000000000002AMW42H.pox-4",
    POOL_OPERATOR: process.env.POOL_OPERATOR,
    POOL_BTC_ADDRESS: process.env.POOL_BTC_ADDRESS,
    POOL_PRIVATE_KEY: process.env.POOL_PRIVATE_KEY,
    SIGNER_PRIVATE_KEY: process.env.SIGNER_PRIVATE_KEY,
    DATABASE_PATH: "src/database/testnet-pox-events.db",
    FIRST_POX_4_CYCLE: 1,
  },
  [NetworkUsed.NakamotoTestnet]: {
    API_URL: "https://api.nakamoto.testnet.hiro.so/extended/v1/tx/events",
    POX_INFO_URL: "https://api.nakamoto.testnet.hiro.so/v2/pox",
    REWARD_INDEXES_API_URL:
      "https://api.nakamoto.testnet.hiro.so/v2/map_entry/ST000000000000000000002AMW42H/pox-4/reward-cycle-pox-address-list",
    GET_TRANSACTION_EXPLORER_URL(txid: string): string {
      return `https://explorer.hiro.so/txid/${txid}?chain=testnet&api=https://api.nakamoto.testnet.hiro.so`;
    },
    GET_BITCOIN_ADDRESS_EXPLORER_URL(address: string): string {
      return `https://mempool.space/testnet/address/${address}`; // TODO: replace this
    },
    GET_STACKS_ADDRESS_EXPLORER_URL(address: string): string {
      return `https://explorer.hiro.so/address/${address}?chain=testnet&api=https://api.nakamoto.testnet.hiro.so`;
    },
    POX_CONTRACT_ADDRESS: "ST000000000000000000002AMW42H.pox-4",
    POOL_OPERATOR: process.env.POOL_OPERATOR,
    POOL_BTC_ADDRESS: process.env.POOL_BTC_ADDRESS,
    POOL_PRIVATE_KEY: process.env.POOL_PRIVATE_KEY,
    SIGNER_PRIVATE_KEY: process.env.SIGNER_PRIVATE_KEY,
    DATABASE_PATH: "src/database/nakamoto-testnet-pox-events.db",
    FIRST_POX_4_CYCLE: 1,
  },
  [NetworkUsed.Devnet]: {
    API_URL: "http://localhost:3999/extended/v1/tx/events",
    POX_INFO_URL: "http://localhost:3999/v2/pox",
    REWARD_INDEXES_API_URL:
      "http://localhost:3999/v2/map_entry/ST000000000000000000002AMW42H/pox-4/reward-cycle-pox-address-list",
    GET_TRANSACTION_EXPLORER_URL(txid: string): string {
      return `http://localhost:8000/txid/${txid}?chain=mainnet`;
    },
    GET_BITCOIN_ADDRESS_EXPLORER_URL(address: string): string {
      return `http://localhost:8001/address/${address}`;
    },
    GET_STACKS_ADDRESS_EXPLORER_URL(address: string): string {
      return `http://localhost:8000/address/${address}?chain=mainnet`;
    },
    POX_CONTRACT_ADDRESS: "ST000000000000000000002AMW42H.pox-4",
    POOL_OPERATOR: process.env.POOL_OPERATOR,
    POOL_BTC_ADDRESS: process.env.POOL_BTC_ADDRESS,
    POOL_PRIVATE_KEY: process.env.POOL_PRIVATE_KEY,
    SIGNER_PRIVATE_KEY: process.env.SIGNER_PRIVATE_KEY,
    DATABASE_PATH: "src/database/devnet-pox-events.db",
    FIRST_POX_4_CYCLE: 1,
  },
};

const currentConfig = API_CONFIG[NETWORK];
console.log("network: ", NETWORK);

export const API_URL = currentConfig.API_URL;
export const POX_INFO_URL = currentConfig.POX_INFO_URL;
export const REWARD_INDEXES_API_URL = currentConfig.REWARD_INDEXES_API_URL;
export const GET_TRANSACTION_EXPLORER_URL =
  currentConfig.GET_TRANSACTION_EXPLORER_URL;
export const GET_BITCOIN_ADDRESS_EXPLORER_URL =
  currentConfig.GET_BITCOIN_ADDRESS_EXPLORER_URL;
export const GET_STACKS_ADDRESS_EXPLORER_URL =
  currentConfig.GET_STACKS_ADDRESS_EXPLORER_URL;
export const POX_CONTRACT_ADDRESS = currentConfig.POX_CONTRACT_ADDRESS;
export const POOL_OPERATOR = currentConfig.POOL_OPERATOR;
export const DATABASE_PATH = currentConfig.DATABASE_PATH;
export const POOL_BTC_ADDRESS = currentConfig.POOL_BTC_ADDRESS;
export const POOL_PRIVATE_KEY = currentConfig.POOL_PRIVATE_KEY;
export const SIGNER_PRIVATE_KEY = currentConfig.SIGNER_PRIVATE_KEY;
export const FIRST_POX_4_CYCLE = currentConfig.FIRST_POX_4_CYCLE;

export const LIMIT = 100;
export const MAX_CYCLES_FOR_OPERATIONS = 12;
export const SERVER_PORT = 8080;
