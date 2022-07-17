const Project = require('../../../models/project/Project');

module.exports = (req, res) => {
  const identifier = req.originalUrl.replace('/projects/guide/', '');

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
      url: '/projects/guide',
      project
    });
  })
}
