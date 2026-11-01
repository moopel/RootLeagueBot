import type { Database } from "sqlite3";
import type { UserGuid } from "@rootsdk/server-bot";

export interface LeagueUserRow {
  UserGuid: UserGuid;
  LeagueUserName: string;
  DateRegistered: string;
}

const CREATE_LEAGUE_USERS_TABLE = `
  CREATE TABLE IF NOT EXISTS league_users (
    userGuid TEXT PRIMARY KEY NOT NULL,
    leagueUserName TEXT NOT NULL,
    dateRegistered TEXT NOT NULL DEFAULT (current_timestamp)
  )
`;

export function createLeagueUsersTable(connection: Database): Promise<void> {
  return new Promise((resolve, reject) => {
    connection.run(CREATE_LEAGUE_USERS_TABLE, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}
