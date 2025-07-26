export const CHAIN_DECIMALS = {
  1: 18, // 以太坊
  56: 18, // BNB Chain
  137: 18, // Polygon
  43114: 18, // Avalanche C链
  250: 18, // Fantom
  1284: 18, // Moonriver
  1285: 18, // Moonbeam
  1666600000: 18, // Harmony
  42161: 18, // Arbitrum
  421613: 18, // Arbitrum Testnet
  43113: 18, // Avalanche Testnet
  80001: 18, // Polygon Testnet
  97: 18, // BNB Testnet
  5: 18, // 以太坊 Testnet
  3: 18, // Ropsten
  4: 18, // Rinkey
  42: 18, // Kovan
};

export const CHAIN_SYMBOL = {
  1: "ETH", // 以太坊
  56: "BNB", // BNB Chain
  137: "POL", // Polygon
  43114: "AVAX", // Avalanche C链
};

export const dealWithTxSteps = {
  create: 0,
  confirm: 1,
  execute: 2,
};
