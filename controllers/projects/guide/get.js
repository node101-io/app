const Project = require('../../../models/project/Project');

module.exports = (req, res) => {
  Project.findProjectByIdAndFormat(req.query.id, (err, project) => {
    if (err)
      return res.redirect('/error?message=' + err);

    return res.render('projects/guide', {
      page: 'projects/guide',
      title: project.name,
      includes: {
        external: {
          css: ['confirm', 'fontawesome', 'general', 'header', 'page'],
          js: ['confirm', 'header', 'page', 'projects', 'serverRequest']
        }
      },
      url: '/projects/guide',
      project
    });
  })
}
