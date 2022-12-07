module.exports = (req, res) => {
  return res.render('admin/bash', {
    page: 'admin/bash',
    title: 'Upload Bash',
    includes: {
      external: {
        css: ['admin', 'fontawesome', 'general', 'page'],
        js: ['page', 'serverRequest']
      }
    }
  });
}
