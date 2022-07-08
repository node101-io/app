module.exports = (req, res) => {
  return res.render('index/index', {
    page: 'index/index',
    title: res.__('Everything you need to know to start earning with krypto'),
    includes: {
      external: {
        css: ['confirm', 'fontawesome', 'general', 'header', 'page'],
        js: ['confirm', 'header', 'page', 'projects', 'serverRequest']
      }
    },
    url: '/'
  });
}
