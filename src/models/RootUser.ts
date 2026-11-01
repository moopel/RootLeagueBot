import type { UserGuid } from "@rootsdk/server-bot";

export class RootUser {
  public readonly name: string;
  public readonly nickname: string;
  public readonly userId: UserGuid;

  constructor(
    name: string,
    nickname: string,
    userId: UserGuid,
  ) {
    this.name = name;
    this.nickname = nickname;
    this.userId = userId;
  }

  get mention(): string {
    return `[@${this.nickname}](root://user/${this.userId})`;
  }

  toString(): string {
    return `${this.nickname} (${this.userId})`;
  }
}
