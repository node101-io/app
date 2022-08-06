const Writer = require('../../../../models/writer/Writer');

module.exports = (req, res) => {
  Writer.findAllWritersInAlphabeticalOrder((err, writers) => {
    if (err) return res.redirect('/admin');

    return res.render('admin/writers/index', {
      page: 'admin/writers/index',
      title: 'Writers',
      includes: {
        external: {
          css: ['confirm', 'admin', 'fontawesome', 'general', 'page', 'projects'],
          js: ['ancestorWithClassName', 'confirm', 'admin', 'page', 'serverRequest']
        }
      },
      writers,
      url: '/admin/writers'
    });
  });
}
