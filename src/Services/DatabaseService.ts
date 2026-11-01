import { createRequire } from "node:module";
import { join } from "node:path";
import type { Database as SqliteDatabase } from "sqlite3";
import sqlite3 from "sqlite3";
import type { UserGuid } from "@rootsdk/server-bot";
import type { LeagueUserDto } from "../models/LeagueUserDto";
import type { LeagueUserUpdateRequest } from "../models/LeagueUserUpdateRequest";
import type { LeagueUserRegisterRequest } from "../models/LeagueUserRegisterRequest";
import {
  createLeagueUsersTable,
  type LeagueUserRow,
} from "../Constants/DatabaseSchema.ts";

const { Database } = sqlite3;

let database: SqliteDatabase | undefined;

export async function initializeDatabase(): Promise<void> {
  const require = createRequire(join(process.cwd(), "package.json"));
  const { rootServer } = require("@rootsdk/server-bot") as typeof import("@rootsdk/server-bot");
  const filename = rootServer.dataStore.config.sqlite3?.filename;
  if (filename === undefined) {
    throw new Error("Root did not provide a SQLite database filename.");
  }

  const connection = await new Promise<SqliteDatabase>((resolve, reject) => {
    const openedDatabase = new Database(filename, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve(openedDatabase);
      }
    });
  });

  try {
    await createLeagueUsersTable(connection);
    database = connection;
  } catch (error) {
    await new Promise<void>((resolve, reject) => {
      connection.close((closeError) => {
        if (closeError) {
          reject(closeError);
        } else {
          resolve();
        }
      });
    });
    throw error;
  }
}

export function getDatabase(): SqliteDatabase {
  if (database === undefined) {
    throw new Error("The database has not been initialized.");
  }

  return database;
}

function findOne(
  connection: SqliteDatabase,
  sql: string,
  value: string,
): Promise<LeagueUserDto | null> {
  return new Promise((resolve, reject) => {
    connection.get<LeagueUserRow>(sql, [value], (error, row) => {
      if (error) {
        reject(error);
      } else if (row === undefined) {
        resolve(null);
      } else {
        resolve({
          UserGuid: row.UserGuid,
          LeagueUserName: row.LeagueUserName,
          DateRegistered: new Date(row.DateRegistered.replace(" ", "T") + "Z"),
        });
      }
    });
  });
}

export async function getUserByGuid(
  guid: UserGuid,
  connection: SqliteDatabase = getDatabase(),
): Promise<LeagueUserDto | null> {
  return findOne(
    connection,
    `SELECT
       userGuid AS UserGuid,
       leagueUserName AS LeagueUserName,
       dateRegistered AS DateRegistered
     FROM league_users
     WHERE userGuid = ?`,
    guid,
  );
}

export async function getUserByLeagueUser(
  leagueUser: string,
  connection: SqliteDatabase = getDatabase(),
): Promise<LeagueUserDto | null> {
  return findOne(
    connection,
    `SELECT
       userGuid AS UserGuid,
       leagueUserName AS LeagueUserName,
       dateRegistered AS DateRegistered
     FROM league_users
     WHERE leagueUserName = ?`,
    leagueUser,
  );
}

export async function updateUser(
  guid: UserGuid,
  request: LeagueUserUpdateRequest,
  connection: SqliteDatabase = getDatabase(),
): Promise<LeagueUserDto | null> {
  await new Promise<void>((resolve, reject) => {
    connection.run(
      "UPDATE league_users SET leagueUserName = ? WHERE userGuid = ?",
      [request.LeagueUserName, guid],
      (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      },
    );
  });

  return getUserByGuid(guid, connection);
}

export async function registerUser(
  request: LeagueUserRegisterRequest,
  connection: SqliteDatabase = getDatabase(),
): Promise<LeagueUserDto | null> {
  const inserted = await new Promise<boolean>((resolve, reject) => {
    connection.run(
      `INSERT INTO league_users (userGuid, leagueUserName)
       VALUES (?, ?)
       ON CONFLICT(userGuid) DO NOTHING`,
      [request.UserGuid, request.LeagueUserName],
      function (error) {
        if (error) {
          reject(error);
        } else {
          resolve(this.changes > 0);
        }
      },
    );
  });

  return inserted ? getUserByGuid(request.UserGuid, connection) : null;
}
