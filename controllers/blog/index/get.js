const Blog = require('../../../models/blog/Blog');

module.exports = (req, res) => {
  const identifier = req.originalUrl.replace('/blog/', '');
  const page_lang = req.query.lang ? req.query.lang : (req.headers['accept-language'] ? req.headers['accept-language'].split('-')[0] : 'en');

  Blog.findBlogByIdentifier(identifier, (err, blog) => {
    if (err) return res.redirect('/error?message=' + err);

    return res.render('blog/index', {
      page: 'blog/index',
      title: blog.title,
      includes: {
        external: {
          css: ['confirm', 'footer', 'general', 'header', 'page'],
          js: ['ancestorWithClassName', 'confirm', 'header', 'page', 'projects', 'serverRequest']
        }
      },
      url: '/blog/' + identifier,
      lang: req.query.lang,
      page_lang,
      blog
    });
  });
}
