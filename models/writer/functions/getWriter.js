module.exports = (writer, callback) => {
  if (!writer || !writer._id)
    return callback('bad_request');

  return callback(null, {
    _id: writer._id.toString(),
    name: writer.name,
    image: writer.image,
    position: writer.position,
    links: writer.links
  });
}
