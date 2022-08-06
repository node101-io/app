const Blog = require('../../../../models/blog/Blog');
const Writer = require('../../../../models/writer/Writer');

module.exports = (req, res) => {
  Blog.findBlogById(req.query.id, (err, blog) => {
    if (err) return res.redirect('/error?message=' + err);

    Writer.findAllWritersInAlphabeticalOrder((err, writers) => {
      if (err) return res.redirect('/error?message=' + err);
  
      return res.render('admin/blogs/edit', {
        page: 'admin/blogs/edit',
        title: blog.name,
        includes: {
          external: {
            css: ['admin', 'confirm', 'fontawesome', 'general', 'page'],
            js: ['ancestorWithClassName', 'admin', 'confirm', 'dragAndDrop', 'duplicateElement', 'page', 'serverRequest']
          }
        },
        url: '/admin/blogs/edit',
        content_type_values: ['title', 'text', 'code', 'info', 'image', 'video'],
        blog,
        writers
      }); 
    });
  });
}
