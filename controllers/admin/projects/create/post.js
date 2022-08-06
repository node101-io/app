const Project = require('../../../../models/project/Project');

module.exports = (req, res) => {
  Project.createProject(req.body, (err, id) => {
    if (err) {
      res.write(JSON.stringify({ error: err, success: false }));
      return res.end();
    }

    res.write(JSON.stringify({ success: true, id }));
    return res.end();
  })
}
