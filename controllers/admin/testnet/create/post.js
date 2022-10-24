const Testnet = require('../../../../models/testnet/Testnet');

module.exports = (req, res) => {
  console.log(req.body)
  Testnet.createTestnet(req.body, (err, id) => {
    if (err) {
      res.write(JSON.stringify({ error: err, success: false }));
      return res.end();
    }
    
    res.write(JSON.stringify({ success: true, id }));
    return res.end();
  })
}
