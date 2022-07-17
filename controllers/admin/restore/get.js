const Project = require('../../../models/project/Project');

module.exports = (req, res) => {
  Project.findProjectByIdAndRestore(req.query.id, err => {
    if (err)
      return res.redirect('/error?message=' + err);

    return res.redirect('/admin/delete');
  });
}
