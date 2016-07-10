export function extend (dest, src) {
  for (const key in src) {
    dest[key] = src[key]
  }
}
