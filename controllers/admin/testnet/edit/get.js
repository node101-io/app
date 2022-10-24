const Testnet = require('../../../../models/testnet/Testnet');

module.exports = (req, res) => {
  Testnet.findTestnetById(req.query.id, (err, testnet) => {
    if (err)
      return res.redirect('/error?message=' + err);

    return res.render('admin/testnet/edit', {
      page: 'admin/testnet/edit',
      title: testnet.name,
      includes: {
        external: {
          css: ['admin', 'confirm', 'fontawesome', 'general', 'page'],
          js: ['admin', 'confirm', 'dragAndDrop', 'duplicateElement', 'page',  'serverRequest']
        }
      },
      url: '/admin/testnet/edit',
      guide_type_values: ['title', 'text', 'code', 'info', 'image', 'video'],
      testnet
    });
  })
}
