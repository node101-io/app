module.exports = (req, res) => {
  return res.render('admin/create', {
    page: 'admin/create',
    title: 'New Project',
    includes: {
      external: {
        css: ['admin', 'confirm', 'fontawesome', 'general', 'page'],
        js: ['admin', 'confirm', 'dragAndDrop', 'duplicateElement', 'page', 'projects',  'serverRequest']
      }
    },
    url: '/admin/create',
    guide_type_values: ['title', 'text', 'code', 'info', 'image', 'video']
  });
}
