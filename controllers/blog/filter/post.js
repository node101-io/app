const Blog = require('../../../models/blog/Blog');

module.exports = (req, res) => {
  Blog.findBlogsByTypeAndLanguage(req.body, (err, blogs) => {
    if (err) {
      res.write(JSON.stringify({ error: err, success: false }));
      return res.end();
    }

    res.write(JSON.stringify({ success: true, blogs }));
    return res.end();
  })
}
