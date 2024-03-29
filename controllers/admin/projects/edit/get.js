const Project = require('../../../../models/project/Project');

module.exports = (req, res) => {
  Project.findProjectById(req.query.id, (err, project) => {
    if (err)
      return res.redirect('/error?message=' + err);

    return res.render('admin/projects/edit', {
      page: 'admin/projects/edit',
      title: project.name,
      includes: {
        external: {
          css: ['admin', 'confirm', 'fontawesome', 'general', 'page'],
          js: ['admin', 'confirm', 'dragAndDrop', 'duplicateElement', 'page', 'projects',  'serverRequest']
        }
      },
      url: '/admin/projects/edit',
      guide_type_values: ['title', 'text', 'code', 'info', 'image', 'video'],
      project
    });
  })
}
