const MAX_DATABASE_TEXT_FIELD_LENGTH = 1e4;

const content_type_values = ['text', 'code', 'title', 'info', 'image', 'video'];

module.exports = data => {
  const content = [];

  if (Array.isArray(data))
    for (let i = 0; i < data.length; i++) {
      const item = data[i];

      if (item.type && content_type_values.includes(item.type) && item.content && typeof item.content == 'string' && item.content.trim().length && item.content.length < MAX_DATABASE_TEXT_FIELD_LENGTH)
        content.push({
          type: item.type,
          content: item.content.split('&amp;').join('&').split('<br>').join('\n')
        });
    }

  return content;
}
