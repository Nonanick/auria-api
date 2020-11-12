export type ApiMaestroCommand = (payload: any) => void;

export const MaestroCommands: {
  [name: string]: ApiMaestroCommand;
} = {

};