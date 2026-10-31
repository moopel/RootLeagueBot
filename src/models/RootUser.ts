import { UserGuid } from "@rootsdk/server-bot";

export class RootUser {
  constructor(
    public readonly name: string,
    public readonly nickname: string,
    public readonly userId: UserGuid,
  ) {}

  get mention(): string {
    return `[@${this.nickname}](root://user/${this.userId})`;
  }
}
