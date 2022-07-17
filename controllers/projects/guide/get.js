const Project = require('../../../models/project/Project');

module.exports = (req, res) => {
  const identifier = req.originalUrl.replace('/projects/guide/', '');
  const page_lang = req.query.lang ? req.query.lang : (req.headers['accept-language'] ? req.headers['accept-language'].split('-')[0] : 'en');
  const identifier_prefix = identifier.split('_')[0];

  Project.findProjectByIdentifier(identifier_prefix + (page_lang != 'en' ? '_' + page_lang : ''), (err, project) => {
    if (!err)
      return res.render('projects/guide', {
        page: 'projects/guide',
        title: project.name + ' - ' + project.description,
        includes: {
          external: {
            css: ['confirm', 'footer', 'general', 'header', 'page'],
            js: ['confirm', 'header', 'page', 'projects', 'serverRequest']
          }
        },
        url: '/projects/guide/' + identifier_prefix + (page_lang != 'en' ? '_' + page_lang : ''),
        lang: req.query.lang,
        page_lang,
        project
      });

    Project.findProjectByIdentifier(identifier, (err, project) => {
      if (err)
        return res.redirect('/error?message=' + err);

      return res.render('projects/guide', {
        page: 'projects/guide',
        title: project.name + ' - ' + project.description,
        includes: {
          external: {
            css: ['confirm', 'footer', 'general', 'header', 'page'],
            js: ['confirm', 'header', 'page', 'projects', 'serverRequest']
          }
        },
        url: '/projects/guide/' + identifier,
        lang: req.query.lang,
        page_lang,
        project
      });
    })
  });
}
