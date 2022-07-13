const validator = require('validator');

const link_values = ['web', 'github', 'telegram', 'medium', 'twitter', 'instagram', 'gitbook', 'docs', 'explorer'];

module.exports = data => {
  const links = {
    web: null,
    github: null,
    telegram: null,
    medium: null,
    twitter: null,
    instagram: null,
    gitbook: null,
    docs: null,
    explorer: null
  };

  if (!data || typeof data != 'object')
    return links;

  Object.keys(data).forEach(key => {
    if (link_values.includes(key) && validator.isURL(data[key].toString()))
      links[key] = data[key].toString();
  });

  return links;
}
