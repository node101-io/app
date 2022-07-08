const Project = require('../../../models/project/Project');

module.exports = (req, res) => {
  Project.findProjectByIdAndFormat(req.query.id, (err, project) => {
    if (err)
      return res.redirect('/error?message=' + err);

    return res.render('admin/edit', {
      page: 'admin/edit',
      title: project.name,
      includes: {
        external: {
          css: ['admin', 'confirm', 'fontawesome', 'general', 'page'],
          js: ['admin', 'confirm', 'dragAndDrop', 'duplicateElement', 'page', 'projects',  'serverRequest']
        }
      },
      url: '/admin/edit',
      guide_type_values: ['title', 'text', 'code', 'info', 'image', 'video'],
      project
    });
  })
}
