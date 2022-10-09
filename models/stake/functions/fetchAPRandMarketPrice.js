// Disabled the function for now

const fetch = require('node-fetch');

module.exports = (data, callback) => {
  if (!data || typeof data != 'object')
    return callback('bad_request');

  if (!data.apr_url || typeof data.apr_url != 'string')
    return callback('bad_request');

  if (!data.market_price_url || typeof data.market_price_url != 'string')
    return callback('bad_request');

  fetch(data.apr_url, {
    method: 'GET'
  })
    .then(res => res.json())
    .then(apr => {
      if (!apr || isNaN(parseFloat(apr)))
        return callback('bad_request');

      fetch(data.market_price_url, {
        method: 'GET'
      })
        .then(res => res.json())
        .then(data => {
          if (!data || !data.price || isNaN(parseFloat(data.price)))
            return callback('bad_request');
    
          callback(null, {
            apr: parseFloat(apr),
            market_price: parseFloat(data.price)
          });
        })
        .catch(err => callback('network_error'));
    })
    .catch(err => callback('network_error'));
}
