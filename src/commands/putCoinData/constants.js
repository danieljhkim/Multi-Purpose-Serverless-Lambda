const coinList = "ethereum,bitcoin,ripple,solana,dogecoin,tether,usd-coin,compound-usd-coin,theta-token,compound-ether,axie-infinity,true-usd,filecoin,decentraland,the-sandbox,apecoin,kucoin-shares,internet-computer,frax,binancecoin,cardano,binance-usd,okb,polkadot,chain-2,wrapped-bitcoin,tron,flow,dai,cosmos,staked-ether,tezos,theta-fuel,hedera-hashgraph,avalanche-2,near,uniswap,shiba-inu,vechain,leo-token,algorand,crypto-com-chain,matic-network,stellar,bitcoin-cash,ftx-token,monero,ethereum-classic,vechai";
const rCoins = ["ethereum", "bitcoin", "ripple"]
const stableCoins = ["tether", "usd-coin","binance-usd","dai","frax","true-usd","compound-usd-coin"]
const dbCoins = [...rCoins];

module.exports = { coinList, rCoins, stableCoins, dbCoins };