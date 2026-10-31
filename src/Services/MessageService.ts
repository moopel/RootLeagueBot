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

export function initializeMessageHandler(): void {
  // subscribe to be notified when members post new messages to any channel your Bot can see
  rootServer.community.channelMessages.on(ChannelMessageEvent.ChannelMessageCreated, onMessage);
}

async function onMessage(evt: ChannelMessageCreatedEvent): Promise<void> {
  // Ignore Root System messages - they aren't of interest to the Bot, nor will they have any 'messageContent'
  if (evt.messageType === MessageType.System) return;

  const message: RootMessage = new RootMessage(evt.messageContent, evt.messageType);

  let responseMessage: string = "Processing...";

  await sendMessage(evt.channelId, responseMessage);
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
  } catch (xcpt: unknown) {
    // Handle Root-generated exceptions
    if (xcpt instanceof RootApiException) {
      // 'errorCode' tells you what went wrong.
      // E.g., perhaps your Bot doesn't have permission to create messages.
      console.error("RootApiException:", xcpt.errorCode);
    } else if (xcpt instanceof Error) {
      console.error("Unexpected error:", xcpt.message);
    } else {
      console.error("Unknown error:", xcpt);
    }
  }
}
