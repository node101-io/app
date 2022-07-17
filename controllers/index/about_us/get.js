module.exports = (req, res) => {
  const page_lang = req.query.lang ? req.query.lang : (req.headers['accept-language'] ? req.headers['accept-language'].split('-')[0] : 'en');

  return res.render('index/about_us', {
    page: 'index/about_us',
    title: res.__('Who are we?'),
    includes: {
      external: {
        css: ['confirm', 'footer', 'general', 'header', 'page'],
        js: ['ancestorWithClassName', 'confirm', 'header', 'page', 'projects', 'serverRequest']
      }
    },
    url: '/about_us',
    lang: req.query.lang,
    page_lang
  });
}
