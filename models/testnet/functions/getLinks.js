const validator = require('validator');

const link_values = ['web', 'github', 'telegram', 'medium', 'twitter', 'instagram', 'gitbook', 'docs', 'discord', 'explorer'];

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
    discord: null,
    explorer: null
  };
  console.log("zobbers")
  if (!data || typeof data != 'object' || data == null)
    return links;

  Object.keys(data).forEach(key => {
    if (link_values.includes(key) && validator.isURL(data[key]))
      links[key] = data[key].toString();
  });
  console.log("its linkin time")
  return links;
}
