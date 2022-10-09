const Stake = require('../../../../models/stake/Stake');

module.exports = (req, res) => {
  Stake.findStakeById(req.query.id, (err, stake) => {
    if (err)
      return res.redirect('/error?message=' + err);

    return res.render('admin/stake/edit', {
      page: 'admin/stake/edit',
      title: stake.name,
      includes: {
        external: {
          css: ['admin', 'confirm', 'fontawesome', 'general', 'page'],
          js: ['admin', 'confirm', 'dragAndDrop', 'duplicateElement', 'page', 'projects',  'serverRequest']
        }
      },
      url: '/admin/stake/edit',
      guide_type_values: ['title', 'text', 'code', 'info', 'image', 'video'],
      stake
    });
  })
}
