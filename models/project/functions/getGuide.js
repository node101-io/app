const MAX_DATABASE_TEXT_FIELD_LENGTH = 1e4;

const guide_type_values = ['text', 'code', 'title', 'info', 'image', 'video'];

module.exports = data => {
  const guide = [];

  if (Array.isArray(data))
    for (let i = 0; i < data.length; i++) {
      const item = data[i];

      if (item.type && guide_type_values.includes(item.type) && item.content && typeof item.content == 'string' && item.content.trim().length && item.content.length < MAX_DATABASE_TEXT_FIELD_LENGTH)
        guide.push({
          type: item.type,
          content: item.content.split('&amp;').join('&')
        });
    }

  return guide;
}
