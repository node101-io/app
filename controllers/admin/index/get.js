const language_values = ['en', 'tr', 'ru'];

module.exports = (req, res) => {
  let language = req.originalUrl.replace('/admin', '');
  language = language.split('/').join('');

  if (!language || !language.length)
    language = 'en';

  if (!language_values.includes(language))
    return res.redirect('/admin');

  return res.render('admin/index', {
    page: 'admin/index',
    title: 'Admin Page',
    includes: {
      external: {
        css: ['confirm', 'admin', 'fontawesome', 'general', 'page', 'projects'],
        js: ['ancestorWithClassName', 'confirm', 'admin', 'page', 'serverRequest', 'projects']
      }
    },
    language,
    url: '/admin'
  });
}
