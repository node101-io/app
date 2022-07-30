const Cryptist = require('../../../models/cryptist/Cryptist');

module.exports = (req, res) => {
  Cryptist.createAll(err => {
    if (err) return res.json({ "success": false, "error": err});

    return res.json({ "success": true })
  });
}
