module.exports = (req, res) => {
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
    lang: req.query.lang
  });
}
