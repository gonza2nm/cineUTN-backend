export class Genero {
  constructor(public id: number, public nombre: string) {
    this.id = id;
    this.nombre = nombre;
  }
}

const genero1 = new Genero(1, 'Terror');
console.log(genero1.id);

console.log(typeof genero1);
