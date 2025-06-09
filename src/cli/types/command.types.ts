

export const cliCommands = ['build', 'clean', 'dev', 'generate', 'publishSdks', 'test', 'upgrade'] as const
export type CliCommands = typeof cliCommands[number]