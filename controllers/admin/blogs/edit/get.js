const Blog = require('../../../../models/blog/Blog');

module.exports = (req, res) => {
  Blog.findBlogById(req.query.id, (err, blog) => {
    if (err)
      return res.redirect('/error?message=' + err);

    return res.render('admin/blogs/edit', {
      page: 'admin/blogs/edit',
      title: blog.name,
      includes: {
        external: {
          css: ['admin', 'confirm', 'fontawesome', 'general', 'page'],
          js: ['admin', 'confirm', 'dragAndDrop', 'duplicateElement', 'page', 'blogs',  'serverRequest']
        }
      },
      url: '/admin/blogs/edit',
      guide_type_values: ['title', 'text', 'code', 'info', 'image', 'video'],
      blog
    });
  })
}
