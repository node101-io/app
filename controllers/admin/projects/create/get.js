module.exports = (req, res) => {
  return res.render('admin/projects/create', {
    page: 'admin/projects/create',
    title: 'New Project',
    includes: {
      external: {
        css: ['admin', 'confirm', 'fontawesome', 'general', 'page'],
        js: ['admin', 'confirm', 'dragAndDrop', 'duplicateElement', 'page', 'projects',  'serverRequest']
      }
    },
    url: '/admin/projects/create',
    guide_type_values: ['title', 'text', 'code', 'info', 'image', 'video']
  });
}
