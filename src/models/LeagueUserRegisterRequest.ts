import { UserGuid } from "@rootsdk/server-bot";

export interface LeagueUserRegisterRequest {
  UserGuid: UserGuid;
  LeagueUserName: string;
}
