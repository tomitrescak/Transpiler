// polyfill
declare global {
  interface Array<T> {
    find(predicate: (search: T) => boolean): T;
  }
}

if (!Array.prototype['find']) {
  Array.prototype['find'] = function(predicate: any) {
    if (this == null) {
      throw new TypeError('Array.prototype.find called on null or undefined');
    }
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate must be a function');
    }
    let list = Object(this);
    let length = list.length >>> 0;
    let thisArg = arguments[1];
    let value: any;

    for (var i = 0; i < length; i++) {
      value = list[i];
      if (predicate.call(thisArg, value, i, list)) {
        return value;
      }
    }
    return undefined;
  };
}

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
