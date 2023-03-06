module.exports = (req, res) => {
  const id = req.originalUrl.split('/youtube/')[1];

  if (!id) return res.redirect('/');

  return res.render('index/youtube', {
    page: 'index/youtube',
    includes: {
      external: {
        css: ['general'],
        js: ['page']
      }
    },
    id
  });
}