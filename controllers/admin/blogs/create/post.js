const Blog = require('../../../../models/blog/Blog');

module.exports = (req, res) => {
  Blog.createBlog(req.body, (err, id) => {
    if (err) {
      res.write(JSON.stringify({ error: err, success: false }));
      return res.end();
    }

    res.write(JSON.stringify({ success: true, id }));
    return res.end();
  })
}
