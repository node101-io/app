module.exports = (testnet, callback) => {
  if (!testnet || !testnet._id)
    return callback('bad_request');

  if (testnet.is_deleted)
    return callback('not_authenticated_request');

  return callback(null, {
    project_id: testnet.project_id,
    order,
    is_active: testnet.is_active ? true : false,
    language: testnet.language,
    name: testnet.name.trim(),
    image: testnet.image.url,
    created_at: parseInt((new Date()).getTime()),
    description: testnet.description.trim(),
    guide: getGuide(testnet.guide),
    requirements: getRequirements(testnet.requirements),
    status: testnet.status,
    dates: testnet.dates.trim(),
    reward: testnet.reward.trim(),
    get_involved_url: testnet.get_involved_url && validator.isURL(testnet.get_involved_url.toString()) ? testnet.get_involved_url.toString() : null,
    popularity: project.popularity,
    links: getLinks(testnet.links),
  });
}
