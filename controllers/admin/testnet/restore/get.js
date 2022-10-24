const Testnet = require('../../../../models/testnet/Testnet');

module.exports = (req, res) => {
  Testnet.findTestnetByIdAndRestore(req.query.id, err => {
    if (err)
      return res.redirect('/error?message=' + err);

    return res.redirect('/admin/projects/delete');
  });
}
