import { UserGuid } from "@rootsdk/server-bot";

export interface LeagueUserDto {
  UserGuid: UserGuid;
  LeagueUserName: string;
  DateRegistered: Date;
}
