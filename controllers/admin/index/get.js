module.exports = (req, res) => {
  return res.render('admin/index', {
    page: 'admin/index',
    title: 'Admin Page',
    includes: {
      external: {
        css: ['confirm', 'admin', 'fontawesome', 'general', 'page'],
        js: ['confirm', 'admin', 'page', 'serverRequest', 'projects']
      }
    },
    url: '/admin'
  });
}
