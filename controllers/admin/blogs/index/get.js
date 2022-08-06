const language_values = ['en', 'tr', 'ru'];

module.exports = (req, res) => {
  let language = req.query.lang;

  if (!language || !language.length)
    language = 'en';

  if (!language_values.includes(language))
    return res.redirect('/admin');

  return res.render('admin/blogs/index', {
    page: 'admin/blogs/index',
    title: 'Blogs',
    includes: {
      external: {
        css: ['confirm', 'admin', 'fontawesome', 'general', 'page', 'blogs'],
        js: ['ancestorWithClassName', 'confirm', 'admin', 'page', 'serverRequest', 'blogs']
      }
    },
    language,
    url: '/admin/blogs'
  });
}
