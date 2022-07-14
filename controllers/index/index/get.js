module.exports = (req, res) => {
  return res.render('index/index', {
    page: 'index/index',
    title: res.__('Everything you need to know to start earning with krypto'),
    includes: {
      external: {
        css: ['confirm', 'general', 'header', 'page'],
        js: ['ancestorWithClassName', 'confirm', 'header', 'page', 'projects', 'serverRequest']
      }
    },
    url: '/'
  });
}
