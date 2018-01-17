"use strict"

const rp = require('request-promise');

const apiUrl = 'https://www.cryptocompare.com/api/data/coinsnapshot/?fsym=CDN&tsym=BTC';

module.exports = (req, res) => {
  let options = {
    url: apiUrl,
    transform: (body) => JSON.parse(body),
  }

  rp(options).then(json => {
    if(json.Response === 'Error')
      return res.status(500).json(json)

    let exchanges = json.Data.Exchanges.map( e => {
      return {
        market: e.MARKET,
        to: e.TOSYMBOL,
        price: Number(e.PRICE),
        open: Number(e.OPEN24HOUR),
        high: Number(e.HIGH24HOUR),
        low: Number(e.LOW24HOUR),
        volume: Number(e.VOLUME24HOUR),
        volumeTo: Number(e.VOLUME24HOURTO)
      }
    });
    res.json(exchanges)

  } ).catch(err => res.status(500).json({ Request: 'Error', Message: err }))
}
