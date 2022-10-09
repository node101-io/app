module.exports = (req, res) => {
  return res.render('admin/stake/create', {
    page: 'admin/stake/create',
    title: 'New Stake',
    includes: {
      external: {
        css: ['admin', 'confirm', 'fontawesome', 'general', 'page'],
        js: ['admin', 'confirm', 'dragAndDrop', 'duplicateElement', 'page', 'project',  'serverRequest']
      }
    },
    url: '/admin/stake/create',
    guide_type_values: ['title', 'text', 'code', 'info', 'image', 'video']
  });
}
