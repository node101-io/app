const Blog = require('../../../models/blog/Blog');

module.exports = (req, res) => {
  const page_lang = req.query.lang ? req.query.lang : (req.headers['accept-language'] ? req.headers['accept-language'].split('-')[0] : 'en');

  Blog.getTypesWithBlogsByLanguage(page_lang, (err, types) => {
    if (err) return res.redirect('/error?message=' + err);

    return res.render('blog/index', {
      page: 'blog/index',
      title: res.__('Blogs'),
      includes: {
        external: {
          css: ['confirm', 'footer', 'general', 'header', 'page'],
          js: ['ancestorWithClassName', 'confirm', 'header', 'page', 'projects', 'serverRequest']
        }
      },
      url: '/blog',
      lang: req.query.lang,
      page_lang,
      types
    });
  });
}
