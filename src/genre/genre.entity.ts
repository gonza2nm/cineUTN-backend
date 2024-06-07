import crypto from 'node:crypto'

export class Genre {
  constructor(
    public name: string,
    public id = crypto.randomUUID()) { }
}

