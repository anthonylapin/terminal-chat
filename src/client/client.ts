import socketIO from "socket.io-client";
import config from "config";
import repl from "repl";
import chalk from "chalk";

const SERVER_PORT: string = process.env.PORT || config.get("PORT");
const socket = socketIO(`http://localhost:${SERVER_PORT}`);
const username = process.argv[2] || null;

if (!username) {
  console.error(
    chalk.bgRed("You have to enter your username when running app!")
  );
  process.exit(1);
}

socket.on("connect", () => {
  console.log(chalk.green("--- start chatting ---"));
});

socket.on("message", ({ msg, username }: { msg: string; username: string }) => {
  displayMessage(username, msg);
});

socket.on("get history", (data: { message: string; username: string }[]) => {
  data.forEach((msgObj) => {
    msgObj.username === username
      ? console.log(msgObj.message)
      : displayMessage(msgObj.username, msgObj.message);
  });
});

repl.start({
  prompt: "",
  eval: (msg) => {
    socket.send({ msg, username });
  },
});

function displayMessage(username: string, msg: string) {
  console.log(`${chalk.bold(username)}: ${chalk.yellowBright(msg)}`);
}
