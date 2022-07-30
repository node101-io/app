const Cryptist = require('../../models/cryptist/Cryptist');

module.exports = (req, res) => {
  if (req.session && req.session.cryptist)
    return res.render('cryptist/index', {
      page: 'cryptist/index',
      title: 'Welcome to Cryptist!',
      includes: {
        external: {
          css: ['confirm', 'footer', 'general', 'header', 'page', 'projects'],
          js: ['ancestorWithClassName', 'confirm', 'header', 'page', 'projects', 'serverRequest']
        }
      },
      link: req.session.cryptist
    });

  Cryptist.findLastNotUsedLinkAndSetAsUsed((err, link) => {
    if (err)
      return res.render('cryptist/index', {
        page: 'cryptist/index',
        title: 'Welcome to Cryptist!',
        includes: {
          external: {
            css: ['confirm', 'footer', 'general', 'header', 'page', 'projects'],
            js: ['ancestorWithClassName', 'confirm', 'header', 'page', 'projects', 'serverRequest']
          }
        },
        error: err,
        link: null
      });

    req.session.cryptist = link;

    return res.render('cryptist/index', {
      page: 'cryptist/index',
      title: 'Welcome to Cryptist!',
      includes: {
        external: {
          css: ['confirm', 'footer', 'general', 'header', 'page', 'projects'],
          js: ['ancestorWithClassName', 'confirm', 'header', 'page', 'projects', 'serverRequest']
        }
      },
      error: err,
      link
    });
  });
}
