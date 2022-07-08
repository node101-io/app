const Project = require('../../../models/project/Project');

module.exports = (req, res) => {
  Project.findProjectsByFilters(req.body, (err, projects) => {
    if (err) {
      res.write(JSON.stringify({ error: err, success: false }));
      return res.end();
    }

    res.write(JSON.stringify({ success: true, projects }));
    return res.end();
  });
}
