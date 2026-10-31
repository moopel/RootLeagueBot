import { rootServer, RootBotStartState } from "@rootsdk/server-bot";
import { initializeHandler } from "./MessageHandler"; // TODO: remove this line when you no longer need the example code

async function onStarting(state: RootBotStartState) {
  initializeHandler(); // TODO: remove this line when you no longer need the example code
}

(async () => {
  await rootServer.lifecycle.start(onStarting);
})();
