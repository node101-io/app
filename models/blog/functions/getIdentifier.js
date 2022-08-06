module.exports = name => {
  return name
    .toString()
    .toLocaleLowerCase()
    .split('ı').join('i').split('ğ').join('g').split('ü').join('u').split('ş').join('s').split('ö').join('o').split('ç').join('c')
    .split('.').join(' ').split(':').join(' ').split(',').join(' ').split(';').join(' ').split('?').join(' ').split('/').join(' ').split('&').join(' ').split('-').join(' ').split('+').join(' ').split('%').join(' ').split('#').join(' ').split('!').join(' ').split('*').join(' ')
    .trim().split(' ').join('_');
}
