import assert from "node:assert/strict";
import test from "node:test";

import { COMMAND_REGEX } from "../src/Constants/Regex.ts";

test("COMMAND_REGEX matches slash commands with arguments", () => {
  const match = "/echo hello world".match(COMMAND_REGEX);

  assert.ok(match);
  assert.not.null(match);
  assert.equal(match[1], "/echo");
  assert.equal(match[2], "hello world");
});

test("COMMAND_REGEX rejects messages without a slash command", () => {
  assert.equal("echo hello world".match(COMMAND_REGEX), null);
  assert.equal("/echo".match(COMMAND_REGEX), null);
  assert.equal(" /echo hello".match(COMMAND_REGEX), null);
});

test("COMMAND_REGEX is a RegExp instance", () => {
  assert.ok(COMMAND_REGEX instanceof RegExp);
});
