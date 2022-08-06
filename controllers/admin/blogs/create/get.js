const Writer = require('../../../../models/writer/Writer');

module.exports = (req, res) => {
  Writer.findAllWritersInAlphabeticalOrder((err, writers) => {
    if (err) return res.redirect('/error?message=' + err);

    return res.render('admin/blogs/create', {
      page: 'admin/blogs/create',
      title: 'New Blog',
      includes: {
        external: {
          css: ['admin', 'confirm', 'fontawesome', 'general', 'page'],
          js: ['admin', 'ancestorWithClassName', 'confirm', 'dragAndDrop', 'duplicateElement', 'page', 'serverRequest']
        }
      },
      url: '/admin/blogs/create',
      writers,
      content_type_values: ['title', 'text', 'code', 'info', 'image', 'video']
    });
  });
}
