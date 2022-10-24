const Testnet = require('../../../../models/testnet/Testnet');

module.exports = (req, res) => {
  Testnet.findTestnetByIdAndUpdate(req.query.id, req.body, err => {
    if (err) {
      res.write(JSON.stringify({ error: err, success: false }));
      return res.end();
    }

    res.write(JSON.stringify({ success: true }));
    return res.end();
  });
}
