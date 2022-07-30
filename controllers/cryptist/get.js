module.exports = (req, res) => {
  return res.render('cryptist/index', {
    page: 'cryptist/index',
    title: 'Welcome to Cryptist!',
    includes: {
      external: {
        css: ['confirm', 'footer', 'general', 'header', 'page', 'projects'],
        js: ['ancestorWithClassName', 'confirm', 'header', 'page', 'projects', 'serverRequest']
      }
    }
  });
}
