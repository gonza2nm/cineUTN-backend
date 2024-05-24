export class Genre {
  constructor(public id: number, public name: string) {
    this.id = id;
    this.name = name;
  }
}

const genre1 = new Genre(1, 'Terror');
console.log(genre1.id);

console.log(typeof genre1);
