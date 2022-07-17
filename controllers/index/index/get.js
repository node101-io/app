module.exports = (req, res) => {
  const page_lang = req.query.lang ? req.query.lang : (req.headers['accept-language'] ? req.headers['accept-language'].split('-')[0] : 'en');

  return res.render('index/index', {
    page: 'index/index',
    title: res.__('Everything you need to know to start earning with krypto'),
    includes: {
      external: {
        css: ['confirm', 'footer', 'general', 'header', 'page', 'projects'],
        js: ['ancestorWithClassName', 'confirm', 'header', 'page', 'projects', 'serverRequest']
      }
    },
    url: '/',
    lang: req.query.lang,
    page_lang
  });
}
