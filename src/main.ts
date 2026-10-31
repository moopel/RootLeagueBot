import { rootServer, RootBotStartState } from "@rootsdk/server-bot";
import { initializeMessageHandler } from "./Services/MessageService"; // TODO: remove this line when you no longer need the example code

async function onStarting(state: RootBotStartState) {
  initializeMessageHandler();
}

(async () => {
  await rootServer.lifecycle.start(onStarting);
})();
