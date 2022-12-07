const fs = require('fs');

module.exports = (req, res) => {
  if (!req.file || !req.file.filename)
    return res.redirect('/error?message=bad_request');
  
  if (!req.body || !req.body.url || typeof req.body.url != 'string')
    return res.redirect('/error?message=bad_request');

  const dirname = __dirname + '../../../../public'
  const file = fs.readFileSync(req.file.path);
  const directory = dirname + req.body.url.split('/').filter((_, i) => i < req.body.url.split('/').length - 1).join('/');

  if (!fs.existsSync(directory))
    fs.mkdirSync(directory, { recursive: true });
  
  fs.writeFile(dirname + req.body.url, file, err => {
    if (err) return res.redirect('/error?message=upload_error');

    return res.redirect('/admin/bash');
  });
}
