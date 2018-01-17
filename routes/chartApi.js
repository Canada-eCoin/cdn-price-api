"use strict"

const rp = require('request-promise');

const apiUrl = 'https://min-api.cryptocompare.com/data/';

const getOption = {
  '1D': (currency) => _options('histominute', 10, 144, currency),
  '1W': (currency) => _options('histohour', 1, 168, currency),
  '1M': (currency) => _options('histohour', 6, 120, currency),
  '3M': (currency) => _options('histoday', 1, 90, currency),
  '6M': (currency) => _options('histoday', 1, 180, currency),
  '1Y': (currency) => _options('histoday', 1, 365, currency)
}

function _options(path, aggregate, limit, currency) {
  return {
    url: apiUrl+ path,
    transform: (body) => JSON.parse(body),
    qs : {
      e: 'CCCAGG',
      fsym: 'CDN',
      tryConversion: true,
      aggregate: aggregate,
      limit: limit,
      tsym : currency
    }
  }
}

module.exports = (req, res) => {
  let period = req.params.period;
  let currency = req.params.currency;
  let type = req.params.type;
  let options = getOption[period](currency);
  
  rp(options).then(json => {
    if(json.Response === 'Error')
      res.status(500).json(json)

    if(type && type === 'ochl') {
      res.json(json.Data)
    } else {
      res.json(json.Data.map(i => i.close))
    }
  } ).catch(err => res.status(500).json({ Request: 'Error', Message: err }))
}
