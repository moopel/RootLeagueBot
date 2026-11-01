import assert from "node:assert/strict";
import test from "node:test";
import type { LogLevel } from "../src/models/LogLevel.ts";

import { Log } from "../src/Services/LoggerService.ts";

test("Log accepts an object with a level and optional message or error", async () => {
  await assert.doesNotReject(Log({ message: "Ready", level: 0 as LogLevel }));
  await assert.doesNotReject(Log({ error: new Error("Failed"), level: 2 as LogLevel }));
});
