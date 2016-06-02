let cache = [
  '',
  ' ',
  '  ',
  '   ',
  '    ',
  '     ',
  '      ',
  '       ',
  '        ',
  '         '
];

export default function leftPad(str: string, len: number, ch?: string | number) {
  // convert `str` to `string`
  str = str + '';

  // doesn't need to pad
  len = len - str.length;
  if (len <= 0) { return str };

  // convert `ch` to `string`
  if (!ch && ch !== 0) {
    ch = ' ';
  };
  ch = ch + '';
  if (ch === ' ' && len < 10) { return cache[len] + str; }
  let pad = '';
  while (true) {
    if (len & 1) { pad += ch; }
    len >>= 1;
    if (len) {
      ch += ch;
    } else {
      break;
    }
  }
  return pad + str;
}
