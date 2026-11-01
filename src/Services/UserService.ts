import {
  CommunityMember,
  CommunityMemberGetRequest,
  RootApiException,
  rootServer,
  UserGuid,
} from "@rootsdk/server-bot";
import { RootUser } from "../models/RootUser";
import { Log } from "./LoggerService";
import { LogLevel } from "../models/LogLevel";

export async function getUserData(userId: UserGuid): Promise<RootUser | null> {
  const request: CommunityMemberGetRequest = { userId: userId };
  let member;

  try {
    const member: CommunityMember = await rootServer.community.communityMembers.get(request);
    return new RootUser(member.nickname, member.nickname, userId);
  } catch (error) {
    await Log({ error, level: LogLevel.Error });
    return null;
  }
}
