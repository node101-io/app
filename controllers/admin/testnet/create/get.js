module.exports = (req, res) => {
  return res.render('admin/testnet/create', {
    page: 'admin/testnet/create',
    title: 'New Testnet',
    includes: {
      external: {
        css: ['admin', 'confirm', 'fontawesome', 'general', 'page'],
        js: ['admin', 'confirm', 'dragAndDrop', 'duplicateElement', 'page',  'serverRequest']
      }
    },
    url: '/admin/testnet/create',
    guide_type_values: ['title', 'text', 'code', 'info', 'image', 'video']
  });
}
//630fadbef16770ae1f351c1e