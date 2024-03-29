const Project = require('../../../../models/project/Project');

module.exports = (req, res) => {
  Project.findDeletedProjects((err, projects) => {
    if (err)
      return res.redirect('/error?message=' + err);

    return res.render('admin/projects/delete', {
      page: 'admin/projects/delete',
      title: 'Deleted Projects',
      includes: {
        external: {
          css: ['admin', 'confirm', 'fontawesome', 'general', 'page'],
          js: ['admin', 'confirm', 'page', 'serverRequest']
        }
      },
      url: '/admin/projects/delete',
      projects
    });
  })
}
