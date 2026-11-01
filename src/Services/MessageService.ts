// TODO: delete this example code if not needed

// Use "@rootsdk/server-bot" to import the Root API types
import {
  rootServer,
  MessageType,
  ChannelMessage,
  ChannelMessageEvent,
  ChannelMessageCreatedEvent,
  ChannelMessageCreateRequest,
  RootApiException,
  ChannelGuid,
} from "@rootsdk/server-bot";
import { RootMessage } from "../models/RootMessage";
import { RootResponseType } from "../models/RootResponseType";
import { registerLeagueUser } from "./LeagueUserService";
import { getUserData } from "./UserService";

export function initializeMessageHandler(): void {
  // subscribe to be notified when members post new messages to any channel your Bot can see
  rootServer.community.channelMessages.on(ChannelMessageEvent.ChannelMessageCreated, onMessage);
}

async function onMessage(event: ChannelMessageCreatedEvent): Promise<void> {
  // Ignore Root System messages - they aren't of interest to the Bot, nor will they have any 'messageContent'
  if (event.messageType === MessageType.System) return;

  const user = await getUserData(event.userId);

  if (user === null) {
    await sendMessage(event.channelId, "Could not identify user from request.");
    return;
  }

  const message: RootMessage = new RootMessage(event.messageContent, event.messageType);

  if (message.Target === null) {
    await sendMessage(event.channelId, `Could not identify ${message.Type} target.`);
    return;
  }

  let responseMessage: string = "Processing...";

  switch (message.Type) {
    case RootResponseType.register: {
      responseMessage = await registerLeagueUser(user, message.Target);
      break;
    }
    // TODO: Implement handlers for the other recognized response types.
    default: {
      responseMessage = `Could not process message of type ${message.Type}`;
      break;
    }
  }

  await sendMessage(event.channelId, responseMessage);
}

async function sendMessage(channelId: ChannelGuid, message: string) {
  const createMessageRequest: ChannelMessageCreateRequest = {
    channelId: channelId,
    content: message,
  };

  try {
    // Send the response to the community
    const cm: ChannelMessage =
      await rootServer.community.channelMessages.create(createMessageRequest);
  } catch (error: unknown) {
    // Handle Root-generated exceptions
    if (error instanceof RootApiException) {
      // 'errorCode' tells you what went wrong.
      // E.g., perhaps your Bot doesn't have permission to create messages.
      console.error("RootApiException:", error.errorCode);
    } else if (error instanceof Error) {
      console.error("Unexpected error:", error.message);
    } else {
      console.error("Unknown error:", error);
    }
  }
}
