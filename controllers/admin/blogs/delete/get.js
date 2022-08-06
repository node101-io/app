const Blog = require('../../../../models/blog/Blog');

module.exports = (req, res) => {
  Blog.findDeletedBlogs((err, blogs) => {
    if (err)
      return res.redirect('/error?message=' + err);

    return res.render('admin/blogs/delete', {
      page: 'admin/blogs/delete',
      title: 'Deleted Blogs',
      includes: {
        external: {
          css: ['admin', 'confirm', 'fontawesome', 'general', 'page'],
          js: ['admin', 'confirm', 'page', 'serverRequest']
        }
      },
      url: '/admin/blogs/delete',
      blogs
    });
  })
}
