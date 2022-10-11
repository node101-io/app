const Stake = require('../../../../models/stake/Stake');

module.exports = (req, res) => {
  Project.findDeletedStakes((err, projects) => {
    if (err)
      return res.redirect('/error?message=' + err);

    return res.render('admin/stake/delete', {
      page: 'admin/stake/delete',
      title: 'Deleted Stakes',
      includes: {
        external: {
          css: ['admin', 'confirm', 'fontawesome', 'general', 'page'],
          js: ['admin', 'confirm', 'page', 'serverRequest']
        }
      },
      url: '/admin/stake/delete',
      projects
    });
  })
}
