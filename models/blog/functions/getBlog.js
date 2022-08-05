const Project = require('../../project/Project');
const Writer = require('../../writer/Writer');

module.exports = (blog, callback) => {
  if (!blog || !blog._id)
    return callback('bad_request');

  if (blog.is_deleted)
    return callback('not_authenticated_request');

  Project.findProjectById(blog.project_id, (err, project) => {
    if (err) return callback(err);

    Writer.findWriterById(blog.writer_id, (err, writer) => {
      if (err) return callback(err);

      return callback(null, {
        _id: blog._id.toString(),
        writer,
        language: blog.language,
        title: blog.title,
        subtitle: blog.subtitle,
        type: blog.type,
        project,
        created_at: blog.created_at,
        image: blog.image,
        content: blog.content,
        view_count: blog.view_count,
        like_count: blog.like_count
      });
    });
  });
}
