const Stake = require('../../../../models/stake/Stake');

module.exports = (req, res) => {
  Stake.findStakesByFilters(req.body, (err, stakes) => {
    if (err) {
      res.write(JSON.stringify({ error: err, success: false }));
      return res.end();
    }

    res.write(JSON.stringify({ success: true, stakes }));
    return res.end();
  });
}
