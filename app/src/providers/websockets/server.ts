import { WebSocketServer } from "ws";

export const init = () => {
  const port = process.env.NEXT_PUBLIC_WEBSOCKETS_PORT as unknown as number;

  const wss = new WebSocketServer({ port });

  wss.on("listening", () => {
    console.log(`wss: listening at ${port}`);
  });

  wss.on("close", () => {
    console.log(`wss: closed ${port}`);
  });

  wss.on("connection", (ws) => {
    console.log(`wss: connected at ${port}`);

    ws.on("message", (message) => {
      console.log(message.toString());
    });
  });

  return wss;
};

export default { init };
