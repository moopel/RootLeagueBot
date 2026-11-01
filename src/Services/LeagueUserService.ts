import { LeagueUserRegisterRequest } from "../models/LeagueUserRegisterRequest";
import { LogLevel } from "../models/LogLevel";
import { RootUser } from "../models/RootUser";
import { registerUser } from "./DatabaseService";
import { Log } from "./LoggerService";

export async function registerLeagueUser(user: RootUser, leagueUsername: string): Promise<string> {
  await Log({ message: `Registering ${user} with ${leagueUsername}`, level: LogLevel.Info });

  const request: LeagueUserRegisterRequest = {
    UserGuid: user.userId,
    LeagueUserName: leagueUsername,
  };
  const registeredUser = await registerUser(request);

  if (registeredUser === null) {
    await Log({
      message: `Error registering user ${user} with ${leagueUsername}`,
      level: LogLevel.Error,
    });
    return "Failed to register";
  }

  await Log({ message: `Registered user ${user} with ${leagueUsername}`, level: LogLevel.Info });
  return `Registered ${user.nickname} with ${leagueUsername}`;
}
