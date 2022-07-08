const MAX_DATABASE_TEXT_FIELD_LENGTH = 1e4;

module.exports = data => {
  const requirements = [];

  if (Array.isArray(data))
    for (let i = 0; i < data.length; i++) {
      const item = data[i];

      if (item.name && typeof item.name == 'string' && item.name.trim().length && item.name.length < MAX_DATABASE_TEXT_FIELD_LENGTH && item.content && typeof item.content == 'string' && item.content.trim().length && item.content.length < MAX_DATABASE_TEXT_FIELD_LENGTH)
        requirements.push({
          name: item.name.trim(),
          content: item.content.trim()
        });
    }

  return requirements;
}
