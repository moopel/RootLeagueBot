import { MessageType } from "@rootsdk/server-bot";
import { contains } from "../utils/string";
import { COMMAND_REGEX } from "../Constants/Regex";
import { RootResponseType } from "../models/RootResponseType";

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

    if (contains(message, `/${RootResponseType.register}`, { ignoreCase: true }))
      type = RootResponseType.register;
    else if (contains(message, `/${RootResponseType.getPatch}`, { ignoreCase: true })) {
      type = RootResponseType.getPatch;
    } else if (contains(message, `/${RootResponseType.echo}`, { ignoreCase: true })) {
      type = RootResponseType.echo;
    }

    this.Type = type ?? RootResponseType.ignore;
    this.Target = commandTarget;
  }
}
