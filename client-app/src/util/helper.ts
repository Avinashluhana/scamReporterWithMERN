

export function shortName(name: string) {
  return name.split(/\s/).map( part => part[0] ).join('').toUpperCase().substring(0, 2);
}
