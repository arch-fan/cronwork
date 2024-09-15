#!/usr/bin/env bun

import { Command } from "commander"
import express from "express"
import { schedule } from "node-cron"
import { description, name, version } from "../package.json"
import { loadTasks, Logger } from "./framework"

const program = new Command()
  .name(name)
  .description(description)
  .version(version)

program
  .command("start")
  .description("Starts running cronjobs")
  .option("-p, --port <port>", "The port to listen on", "3000")
  .action(async (_, { port }) => {
    // All app tasks
    const tasks = await loadTasks()

    // Framework instances
    const logger = new Logger(name)
    const expressApp = express()

    // Instance configs
    expressApp.use(express.json())

    // Dependency injection for tasks
    for (const task of tasks) {
      if (task.execOnce) {
        await task.execOnce()
      }

      if (task.endpoints) {
        const router = express.Router()
        await task.endpoints(router)
        expressApp.use(`/${task.name}`, router)
      }

      schedule(task.schedule, async () => {
        try {
          await task.run()
        } catch (error) {
          if (error instanceof Error) {
            logger.error(`Error at ${task.name}: ${error.message}`)
          } else {
            logger.error(`Unknown error at ${task.name}`)
          }
        }
      })
    }

    // Start express server
    expressApp.listen(port, () => {
      logger.info(`Listening on http://localhost:${port}`)
    })
  })

// Parsear los argumentos de la línea de comandos
program.parse(process.argv)
