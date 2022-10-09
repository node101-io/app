const Project = require('../../../../models/stake/Stake');

module.exports = (req, res) => {
  Stake.findStakeByIdAndDelete(req.query.id, err => {
    if (err) {
      res.write(JSON.stringify({ error: err, success: false }));
      return res.end();
    }

    res.write(JSON.stringify({ success: true }));
    return res.end();
  });
}
