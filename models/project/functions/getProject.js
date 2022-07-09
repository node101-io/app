module.exports = (project, callback) => {
  if (!project || !project._id)
    return callback('bad_request');

  return callback(null, {
    _id: project._id.toString(),
    is_active: project.is_active,
    language: project.language,
    name: project.name,
    image: project.image,
    description: project.description,
    guide: project.guide,
    requirements: project.requirements,
    status: project.status,
    dates: project.dates,
    is_stakable: project.is_stakable,
    stake_url: project.stake_url,
    reward: project.reward,
    get_involved_url: project.get_involved_url,
    popularity: project.popularity,
  });
}
