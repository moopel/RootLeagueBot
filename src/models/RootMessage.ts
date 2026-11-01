import { MessageType } from "@rootsdk/server-bot";
import { doesContain } from "../utils/string.ts";
import { COMMAND_REGEX } from "../Constants/Regex.ts";
import { RootResponseType } from "../models/RootResponseType.ts";
import { LogInfo } from "../Services/LoggerService.ts";

export class RootMessage {
  public readonly Target: string | null;
  public readonly Type: RootResponseType;

  public constructor(message: string, messageType: MessageType) {
    if (messageType === MessageType.System) {
      this.Target = null;
      this.Type = RootResponseType.ignore;
      return;
    }

    message = message.trim();

    // Parse Target and Type
    const match = message.match(COMMAND_REGEX);

    const command = match?.[1] ?? null;
    const commandTarget = match?.[2] ?? null;

    if (command === null || commandTarget === null) {
      this.Target = null;
      this.Type = RootResponseType.ignore;
      return;
    }

    let type: RootResponseType | null = null;

    if (doesContain(message, `/${RootResponseType.register}`, { ignoreCase: true }))
      type = RootResponseType.register;
    else if (doesContain(message, `/${RootResponseType.getPatch}`, { ignoreCase: true })) {
      type = RootResponseType.getPatch;
    } else if (doesContain(message, `/${RootResponseType.echo}`, { ignoreCase: true })) {
      type = RootResponseType.echo;
    }

    LogInfo(`Command: ${command} , CommandTarget: ${commandTarget} , Type: ${type}`);

    this.Type = type ?? RootResponseType.ignore;
    this.Target = commandTarget;
  }

  toString(): string {
    return `RootMessage(Type=${this.Type}, Target=${this.Target ?? "none"})`;
  }
}
