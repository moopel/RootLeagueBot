import type { LogLevel } from "../models/LogLevel";

export interface LogOptions {
  level: LogLevel;
  message?: string;
  error?: unknown;
}

export async function Log(options: LogOptions): Promise<void> {
  console.log(`${options.level}: ${options.message}`);
  // TODO: Send the message to the configured logging destination.
}
