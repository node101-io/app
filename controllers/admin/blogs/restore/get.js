const Blog = require('../../../../models/blog/Blog');

module.exports = (req, res) => {
  Blog.findBlogByIdAndRestore(req.query.id, err => {
    if (err)
      return res.redirect('/error?message=' + err);

    return res.redirect('/admin/blogs/delete');
  });
}
