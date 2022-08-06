const Writer = require('../../../../models/writer/Writer');

module.exports = (req, res) => {
  Writer.createWriter(req.body, (err, id) => {
    if (err) {
      res.write(JSON.stringify({ error: err, success: false }));
      return res.end();
    }

    res.write(JSON.stringify({ success: true, id }));
    return res.end();
  })
}
