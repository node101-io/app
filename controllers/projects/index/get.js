module.exports = (req, res) => {
  const lang = req.query.lang ? req.query.lang : (req.headers['accept-language'] ? req.headers['accept-language'].split('-')[0] : null);

  return res.render('projects/index', {
    page: 'projects/index',
    title: res.__('Search & Find the Best Crypto Projects for You!'),
    includes: {
      external: {
        css: ['confirm', 'footer', 'general', 'header', 'page', 'projects'],
        js: ['ancestorWithClassName', 'confirm', 'header', 'page', 'projects', 'serverRequest']
      }
    },
    url: '/projects',
    lang
  });
}
