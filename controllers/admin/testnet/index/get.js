const language_values = ['en', 'tr', 'ru'];

module.exports = (req, res) => {
  let language = req.query.lang;

  if (!language || !language.length)
    language = 'en';

  if (!language_values.includes(language))
    return res.redirect('/admin');

  return res.render('admin/testnet/index', {
    page: 'admin/testnet/index',
    title: 'Testnets',
    includes: {
      external: {
        css: ['confirm', 'admin', 'fontawesome', 'general', 'page', 'projects'],
        js: ['ancestorWithClassName', 'confirm', 'admin', 'page', 'serverRequest', 'testnet']
      }
    },
    language,
    url: '/admin/testnet'
  });
}
