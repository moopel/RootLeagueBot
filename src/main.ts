import { rootServer, RootBotStartState } from "@rootsdk/server-bot";
import { initializeDatabase } from "./Services/DatabaseService";
import { initializeMessageHandler } from "./Services/MessageService"; // TODO: remove this line when you no longer need the example code
import { Log } from "./Services/LoggerService";
import { LogLevel } from "./models/LogLevel";

async function onStarting(_state: RootBotStartState): Promise<void> {
  Log({ message: "Starting", level: LogLevel.Debug });
  await initializeDatabase();
  initializeMessageHandler();
}

(async () => {
  await rootServer.lifecycle.start(onStarting);
})();
