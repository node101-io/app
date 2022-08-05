const validator = require('validator');

const link_values = ['github', 'telegram', 'medium', 'twitter', 'instagram', 'discord'];

module.exports = data => {
  const links = {
    github: null,
    telegram: null,
    medium: null,
    twitter: null,
    instagram: null,
    discord: null
  };

  if (!data || typeof data != 'object')
    return links;

  Object.keys(data).forEach(key => {
    if (link_values.includes(key) && validator.isURL(data[key].toString()))
      links[key] = data[key].toString();
  });

  return links;
}
