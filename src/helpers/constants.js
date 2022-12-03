const coinList = "bitcoin,ethereum,dash,aptos,zcash,ripple,solana,dogecoin,theta-token,axie-infinity,filecoin,decentraland,the-sandbox,apecoin,kucoin-shares,internet-computer,maker,binancecoin,quant-network,cardano,okb,polkadot,chain-2,wrapped-bitcoin,tron,flow,cosmos,tezos,theta-fuel,hedera-hashgraph,avalanche-2,near,uniswap,shiba-inu,vechain,leo-token,algorand,matic-network,stellar,bitcoin-cash,monero,ethereum-classic,eos,klay-token,pancakeswap-token,neo,helium,evmos,the-graph,fantom";
const stableCoins = ["tether", "usd-coin","binance-usd","dai","frax","true-usd","usdd","gemini-dollar","paxos-standard","compound-usd-coin"];
const coinIndex = [
  'bitcoin',           'ethereum',      'dash',
  'aptos',             'zcash',         'ripple',
  'solana',            'dogecoin',      'theta-token',
  'axie-infinity',     'filecoin',      'decentraland',
  'the-sandbox',       'apecoin',       'kucoin-shares',
  'internet-computer', 'maker',         'binancecoin',
  'quant-network',     'cardano',       'okb',
  'polkadot',          'chain-2',       'wrapped-bitcoin',
  'tron',              'flow',          'cosmos',
  'tezos',             'theta-fuel',    'hedera-hashgraph',
  'avalanche-2',       'near',          'uniswap',
  'shiba-inu',         'vechain',       'leo-token',
  'algorand',          'matic-network', 'stellar',
  'bitcoin-cash',      'monero',        'ethereum-classic',
  'eos',               'klay-token',    'pancakeswap-token',
  'neo',               'helium',        'evmos',
  'the-graph',         'fantom'
];

module.exports = { coinList, stableCoins, coinIndex };
