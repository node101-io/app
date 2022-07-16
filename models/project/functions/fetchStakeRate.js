const fetch = require('node-fetch');

const STAKE_API_URL = 'https://stake.nodes.guru/_next/data/e2KFuh0xDr4wAZxf9P5n3/index.json';

module.exports = (title, callback) => {
  fetch(STAKE_API_URL, {
    method: 'GET'
  })
    .then(data => data.json())
    .then(res => {
      const data = res.pageProps.projects.find(each => each.title == title);
      
      if (!data || !data.apy || isNaN(parseFloat(data.apy)))
        return callback('document_not_found');

      callback(null, parseFloat(data.apy));
    })
    .catch(err => callback('network_error'));
}
