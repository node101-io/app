module.exports = (req, res) => {
  return res.render('admin/writers/create', {
    page: 'admin/writers/create',
    title: 'New Writer',
    includes: {
      external: {
        css: ['admin', 'confirm', 'fontawesome', 'general', 'page'],
        js: ['admin', 'confirm', 'dragAndDrop', 'duplicateElement', 'page', 'projects',  'serverRequest']
      }
    },
    url: '/admin/writers/create',
    guide_type_values: ['title', 'text', 'code', 'info', 'image', 'video']
  });
}
