const Project = require('../../../../models/project/Project');

module.exports = (req, res) => {
  Project.findProjectByIdAndReverseStatus(req.query.id, err => {
    if (err) {
      res.write(JSON.stringify({ error: err, success: false }));
      return res.end();
    }

    res.write(JSON.stringify({ success: true }));
    return res.end();
  });
}
