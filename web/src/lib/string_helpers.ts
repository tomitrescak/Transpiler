export function makeSafeFileName(name: string) {
  return name.replace(/\.\./g, '');
}
