const Project = require('../../../../models/project/Project');

module.exports = (req, res) => {
  Project.findProjectByIdAndUpdateImage(req.query.id, req.body, err => {
    if (err) {
      res.write(JSON.stringify({ error: err, success: false }));
      return res.end();
    }

    res.write(JSON.stringify({ success: true }));
    return res.end();
  })
}
