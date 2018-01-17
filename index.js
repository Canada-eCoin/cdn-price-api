"use strict"
const express = require('express');
const cache = require('express-redis-cache')();

const chartApi = require('./routes/chartApi');
const priceApi = require('./routes/priceApi');
const exchangesApi = require('./routes/exchangesApi');

const app = express();

app.get('/chart/:period/:currency/:type?', cache.route({expire: 360}), chartApi)
app.get('/prices', cache.route({expire: 60}), priceApi)
app.get('/exchanges', cache.route({expire: 60}), exchangesApi)

app.listen(3688, () => console.log('Example app listening on port 3000!'))
