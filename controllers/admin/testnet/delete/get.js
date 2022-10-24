const Testnet = require('../../../../models/testnet/Testnet');

module.exports = (req, res) => {
  Testnet.findDeletedTestnets((err, projects) => {
    if (err)
      return res.redirect('/error?message=' + err);

    return res.render('admin/testnet/delete', {
      page: 'admin/testnet/delete',
      title: 'Deleted Stakes',
      includes: {
        external: {
          css: ['admin', 'confirm', 'fontawesome', 'general', 'page'],
          js: ['admin', 'confirm', 'page', 'serverRequest']
        }
      },
      url: '/admin/testnet/delete',
      projects
    });
  })
}
