module.exports = (req, res) => {
  return res.render('admin/index', {
    page: 'admin/index',
    title: 'Admin Page',
    includes: {
      external: {
        css: ['admin', 'fontawesome', 'general', 'page'],
        js: ['page', 'serverRequest']
      }
    }
  });
}
