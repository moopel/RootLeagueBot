import assert from "node:assert/strict";
import test from "node:test";
import type { Database as SqliteDatabase } from "sqlite3";
import sqlite3 from "sqlite3";

import {
  getUserByGuid,
  getUserByLeagueUser,
  registerUser,
  updateUser,
} from "../src/Services/DatabaseService.ts";
import { createLeagueUsersTable } from "../src/Constants/DatabaseSchema.ts";

const { Database } = sqlite3;

function run(database: SqliteDatabase, sql: string, parameters: unknown[] = []): Promise<void> {
  return new Promise((resolve, reject) => {
    database.run(sql, parameters, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

function all<T>(database: SqliteDatabase, sql: string): Promise<T[]> {
  return new Promise((resolve, reject) => {
    database.all<T>(sql, (error, rows) => {
      if (error) {
        reject(error);
      } else {
        resolve(rows);
      }
    });
  });
}

async function withDatabase(runTest: (database: SqliteDatabase) => Promise<void>): Promise<void> {
  const database = new Database(":memory:");

  try {
    await createLeagueUsersTable(database);
    await runTest(database);
  } finally {
    await new Promise<void>((resolve, reject) => {
      database.close((error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }
}

test("creates league_users with its primary key and registration date default", async () => {
  await withDatabase(async (database) => {
    const columns = await all<{
      name: string;
      type: string;
      notnull: number;
      dflt_value: string | null;
      pk: number;
    }>(database, "PRAGMA table_info(league_users)");

    assert.deepEqual(
      columns.map(({ name, type, notnull, dflt_value, pk }) => ({
        name,
        type,
        notnull,
        dflt_value,
        pk,
      })),
      [
        { name: "userGuid", type: "TEXT", notnull: 1, dflt_value: null, pk: 1 },
        { name: "leagueUserName", type: "TEXT", notnull: 1, dflt_value: null, pk: 0 },
        {
          name: "dateRegistered",
          type: "TEXT",
          notnull: 1,
          dflt_value: "current_timestamp",
          pk: 0,
        },
      ],
    );

    await run(database, "INSERT INTO league_users (userGuid, leagueUserName) VALUES (?, ?)", [
      "user-1",
      "League One",
    ]);

    const rows = await all<{ dateRegistered: string }>(
      database,
      "SELECT dateRegistered FROM league_users WHERE userGuid = 'user-1'",
    );
    assert.match(rows[0].dateRegistered, /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
  });
});

test("registers and retrieves a league user by Root GUID and league username", async () => {
  await withDatabase(async (database) => {
    const registered = await registerUser(
      {
        UserGuid: "root-user-1",
        LeagueUserName: "LeaguePlayer",
      },
      database,
    );

    assert.ok(registered);
    assert.equal(registered.UserGuid, "root-user-1");
    assert.equal(registered.LeagueUserName, "LeaguePlayer");
    assert.ok(registered.DateRegistered instanceof Date);
    assert.equal((await getUserByGuid("root-user-1", database))?.LeagueUserName, "LeaguePlayer");
    assert.equal(
      (await getUserByLeagueUser("LeaguePlayer", database))?.UserGuid,
      "root-user-1",
    );
  });
});

test("returns null for missing users and duplicate registrations", async () => {
  await withDatabase(async (database) => {
    assert.equal(await getUserByGuid("missing", database), null);
    assert.equal(await getUserByLeagueUser("missing", database), null);

    const request = { UserGuid: "root-user-1", LeagueUserName: "LeaguePlayer" };
    assert.ok(await registerUser(request, database));
    assert.equal(await registerUser(request, database), null);
  });
});

test("updates a registered user's league username and returns null for missing users", async () => {
  await withDatabase(async (database) => {
    await registerUser(
      {
        UserGuid: "root-user-1",
        LeagueUserName: "Before",
      },
      database,
    );

    const updated = await updateUser(
      "root-user-1",
      {
        LeagueUserName: "After",
      },
      database,
    );
    assert.equal(updated?.LeagueUserName, "After");
    assert.equal(await updateUser("missing", { LeagueUserName: "After" }, database), null);
  });
});
