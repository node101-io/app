const Project = require('../../../models/project/Project');

module.exports = (req, res) => {
  const lang = req.query.lang ? req.query.lang : (req.headers['accept-language'] ? req.headers['accept-language'].split('-')[0] : null);

  Project.findStakableProjects({
    language: lang
  }, (err, projects) => {
    if (err)
      return res.redirect('/error?message=' + err);

    return res.render('index/stake', {
      page: 'index/stake',
      title: res.__('Stake with us'),
      includes: {
        external: {
          css: ['confirm', 'general', 'header', 'page'],
          js: ['ancestorWithClassName', 'confirm', 'header', 'page', 'projects', 'serverRequest']
        }
      },
      url: '/stake',
      projects
    });
  });
}
