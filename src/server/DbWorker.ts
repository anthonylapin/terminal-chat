import * as fastcsv from "fast-csv";
import fs from "fs";
import path from "path";

interface IMessage {
  message: string;
  username: string;
}

interface IDatabase {
  data: IMessage[];
  readonly path: string;
}

export default class DbWorker implements IDatabase {
  public data: IMessage[];
  readonly path: string;

  constructor() {
    this.path = path.resolve("src", "server", "files", "database.csv");
    this.data = [];

    fs.createReadStream(this.path)
      .pipe(fastcsv.parse())
      .on("error", (error) => console.error(error))
      .on("data", (row) =>
        this.data.push({ username: row[0], message: row[1] })
      );
  }

  public write(message: IMessage) {
    this.data.push(message);
    const ws = fs.createWriteStream(this.path);
    fastcsv.write(this.data).pipe(ws);
  }
}
