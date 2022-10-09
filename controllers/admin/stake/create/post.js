const Stake = require('../../../../models/stake/Stake');

module.exports = (req, res) => {
  Stake.createStake(req.body, (err, id) => {
    if (err) {
      res.write(JSON.stringify({ error: err, success: false }));
      return res.end();
    }

    res.write(JSON.stringify({ success: true, id }));
    return res.end();
  })
}
