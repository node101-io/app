const Blog = require('../../../../models/blog/Blog');

module.exports = (req, res) => {
  Blog.findAllBlogs((err, blogs) => {
    if (err) return res.redirect('/error?message=' + err);

    return res.render('admin/blogs/index', {
      page: 'admin/blogs/index',
      title: 'Blogs',
      includes: {
        external: {
          css: ['confirm', 'admin', 'fontawesome', 'general', 'page', 'blogs'],
          js: ['ancestorWithClassName', 'confirm', 'admin', 'page', 'serverRequest', 'blogs']
        }
      },
      blogs,
      url: '/admin/blogs'
    });
  });
}
