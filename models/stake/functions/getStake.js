module.exports = (project, callback) => {
  if (!project || !project._id)
    return callback('bad_request');

  if (project.is_deleted)
    return callback('not_authenticated_request');

  return callback(null, {
    _id: project._id.toString(),
    is_stakable: project.is_stakable,
    is_active: project.is_active,
    language: project.language,
    name: project.name,
    image: project.image,
    stake_url: project.stake_url,
    how_to_stake_url: project.how_to_stake_url,
    apr: project.apr,
    market_price: project.market_price
  });
}
