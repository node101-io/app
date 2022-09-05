const urldecode = require('urldecode');

const Blog = require('../../../models/blog/Blog');

module.exports = (req, res) => {
  const identifier = urldecode(req.originalUrl.replace('/blog/', '').split('?')[0])
  const page_lang = req.query.lang ? req.query.lang : (req.headers['accept-language'] ? req.headers['accept-language'].split('-')[0] : 'en');

  Blog.findBlogByIdentifierAndLanguage({
    language: page_lang,
    identifier
  }, (err, blog) => {
    if (err) return res.redirect('/error?message=' + err);

    if (blog.identifier != identifier)
      return res.redirect('/blog/' + blog.identifier + (req.query.lang ? '?lang=' + req.query.lang : ''));

    return res.render('blog/details', {
      page: 'blog/details',
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
