import assert from "node:assert/strict";
import test from "node:test";
import type { MessageType, UserGuid } from "@rootsdk/server-bot";

import { RootMessage } from "../src/models/RootMessage.ts";
import { RootUser } from "../src/models/RootUser.ts";
import { RootResponseType } from "../src/models/RootResponseType.ts";

test("RootUser toString includes the nickname and user ID", () => {
  const user = new RootUser("Jane Smith", "Jane", "user-123" as UserGuid);

  assert.equal(user.toString(), "Jane (user-123)");
  assert.equal(`${user}`, "Jane (user-123)");
});

test("RootMessage toString includes its type and target", () => {
  const message = new RootMessage("/register player", 0 as MessageType);

  assert.equal(
    message.toString(),
    `RootMessage(Type=${RootResponseType.register}, Target=player)`,
  );
  assert.equal(`${message}`, message.toString());
});

test("RootMessage ignores system messages", () => {
  const message = new RootMessage("", 2 as MessageType);

  assert.equal(message.Type, RootResponseType.ignore);
  assert.equal(message.Target, null);
});
