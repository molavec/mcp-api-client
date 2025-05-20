const world = 'world';

export function hello(who: string = world): string {
  return `Hello ${who}! `;
}

const gretting = hello('Adolfo');

console.log(gretting);