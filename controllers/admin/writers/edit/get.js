const Writer = require('../../../../models/writer/Writer');

module.exports = (req, res) => {
  Writer.findWriterById(req.query.id, (err, writer) => {
    if (err)
      return res.redirect('/error?message=' + err);

    return res.render('admin/writers/edit', {
      page: 'admin/writers/edit',
      title: writer.name,
      includes: {
        external: {
          css: ['admin', 'confirm', 'fontawesome', 'general', 'page'],
          js: ['admin', 'confirm', 'page', 'serverRequest']
        }
      },
      url: '/admin/writers/edit',
      writer
    });
  })
}
