function formatGuide(guide) {
  if (!guide)
    return guide;

  return guide.map(each => {
    return {
      type: each.type,
      content: each.content
        .split('&lt;').join('<')
        .split('&gt;').join('>')
    }
  });
}

module.exports = (project, callback) => {
  if (!project || !project._id)
    return callback('bad_request');

  if (project.is_deleted)
    return callback('not_authenticated_request');

  return callback(null, {
    _id: project._id.toString(),
    identifier: project.identifier,
    is_active: project.is_active,
    language: project.language,
    name: project.name,
    image: project.image,
    description: project.description,
    guide: formatGuide(project.guide),
    requirements: project.requirements,
    status: project.status,
    dates: project.dates,
    is_stakable: project.is_stakable,
    stake_url: project.stake_url,
    reward: project.reward,
    get_involved_url: project.get_involved_url,
    popularity: project.popularity,
    links: project.links,
    stake_rate: project.stake_rate,
    will_be_stakable: project.will_be_stakable
  });
}
