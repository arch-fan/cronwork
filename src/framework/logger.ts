import { timestamp } from "./internal/timestamp"

const colors = {
  yellow: "\x1b[33m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  blue: "\x1b[34m",
} as const

const formats = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
} as const

export class Logger {
  private taskName: string

  constructor(taskName: string) {
    this.taskName = taskName
  }

  private log(
    message: string,
    color: (typeof colors)[keyof typeof colors],
    emoji: string,
  ) {
    console.log(
      `${color}${formats.bold}${emoji} > ${timestamp()} | ${
        this.taskName
      } | ${message}${formats.reset}`,
    )
  }

  warn(message: string) {
    this.log(message, colors.yellow, "⚠")
  }

  error(message: string) {
    this.log(message, colors.red, "✖")
  }

  info(message: string) {
    this.log(message, colors.blue, "ⓘ")
  }

  success(message: string) {
    this.log(message, colors.green, "✔")
  }
}
