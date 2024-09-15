import type { Router } from "express"
import { Logger } from "./logger"

export abstract class Task {
  // Injected dependencies //
  public name: string
  protected logger: Logger

  constructor(name: string) {
    this.name = name
    this.logger = new Logger(this.name)
  }

  // Abstract properties //
  abstract schedule: string

  // Abstract methods //
  abstract run(): void | Promise<void>
  execOnce?(): void | Promise<void>
  endpoints?(app: Router): void | Promise<void>
}
