import { globby } from "globby"
import type { Task } from "./task"

export const loadTasks = async (): Promise<Task[]> => {
  const tasks: Task[] = []

  const files = await globby(
    ["src/cronjobs/*.{ts,js}", "src/cronjobs/*/*.{ts,js}"],
    {
      absolute: true,
    },
  )

  for (const file of files) {
    const { default: TaskClass }: { default: new (name: string) => Task } =
      await import(file)

    const splitted = file.split("/")
    const taskName = splitted[splitted.length - 1].match(/index\.(ts|js)$/)
      ? splitted[splitted.length - 2]
      : splitted[splitted.length - 1].replace(/\.(ts|js)$/, "")

    tasks.push(new TaskClass(taskName))
  }

  return tasks
}
