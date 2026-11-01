import { LogLevel } from "../models/LogLevel";

export interface LogOptions {
  level: LogLevel;
  message?: string;
  error?: unknown;
}

export async function Log(options: LogOptions): Promise<void> {
  console.log(`${options.level}: ${options.message}`);
  // TODO: Send the message to the configured logging destination.
}

export async function LogDebug(message: string): Promise<void> {
  await Log({ message: message, level: LogLevel.Debug });
}

export async function LogInfo(message: string): Promise<void> {
  await Log({ message: message, level: LogLevel.Info });
}
