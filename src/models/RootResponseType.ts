export const RootResponseType = {
  register: "register",
  getPatch: "getPatch",
  echo: "echo",
  ignore: "",
} as const;

export type RootResponseType = (typeof RootResponseType)[keyof typeof RootResponseType];
