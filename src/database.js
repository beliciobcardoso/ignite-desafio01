import fs from 'node:fs/promises';

const databasePath = new URL('../db.json', import.meta.url);

export class Database {
  #database = {};

  constructor() {
    fs.readFile(databasePath, 'utf8')
      .then((data) => {
        this.#database = JSON.parse(data);
      })
      .catch((erro) => {
        this.#pesist();
        console.log(erro);
      });
  }

  #pesist = async () => {
    await fs.writeFile(databasePath, JSON.stringify(this.#database));
  };

  select(table) {
    const data = this.#database[table] ?? [];

    return data;
  }

  insert(table, data) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data);
    } else {
      this.#database[table] = [data];
    }

    this.#pesist();

    return data;
  }

  delete(table, id) {
    const rowIndex = this.#database[table].findIndex((row) => row.id === id);

    this.#database[table].splice(rowIndex, 1);
    this.#pesist();
  }

  update(table, id, data) {
    const rowIndex = this.#database[table].findIndex((row) => row.id === id);

    this.#database[table][rowIndex] = { id, ...data };

    this.#pesist();
  }

  exists(table, id) {
    return this.#database[table].some((row) => row.id === id);
  }
}
