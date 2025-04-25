



export const parentProcessExitCodes = {
  waitForFileChange: 201,
  restartServer: 202,
  error: 1,
  exit: 0,
} as const satisfies Record<string, number>