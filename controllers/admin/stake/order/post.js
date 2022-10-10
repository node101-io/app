const Stake = require('../../../../models/stake/Stake');

module.exports = (req, res) => {
  Stake.findStakeByIdAndIncreaseOrder(req.query.id, err => {
    if (err) {
      res.write(JSON.stringify({ error: err, success: false }));
      return res.end();
    }

    res.write(JSON.stringify({ success: true }));
    return res.end();
  });
}
