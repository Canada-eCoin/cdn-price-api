"use strict"

const rp = require('request-promise');

const apiUrl = 'https://min-api.cryptocompare.com/data/';

module.exports = (req, res) => {
  let options = {
    url: apiUrl+ 'pricemultifull',
    transform: (body) => JSON.parse(body),
    qs : {
      fsyms: 'CDN',
      tsyms: 'USD,CAD,EUR,PLN,BTC'
    }
  }

  rp(options).then(json => {
    if(json.Response === 'Error')
      res.status(500).json(json)

    let raw = json.RAW.CDN;
    let prices = {}

    Object.keys(raw).forEach(function(key) {
      let market = raw[key];
      prices[key] = {
        price: Number(market.PRICE),
        open: Number(market.OPEN24HOUR),
        high: Number(market.HIGH24HOUR),
        low: Number(market.LOW24HOUR),
        change: Number(market.CHANGEPCT24HOUR),
        volume: Number(market.TOTALVOLUME24H),
        volumeTo: Number(market.TOTALVOLUME24HTO),
        marketCap:  Number(market.MKTCAP)
      }
    });

    res.json(prices)

  } ).catch(err => res.status(500).json({ Request: 'Error', Message: err }))
}
