module.exports = (req, res) => {
  const id = req.originalUrl.split('?')[0].split('/youtube/')[1];

  if (!id || !id.length) return res.render('index/youtube');

  return res.redirect('/youtube/?id=' + id)
}