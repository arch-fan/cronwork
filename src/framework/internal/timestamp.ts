export const timestamp = () => {
  const now = new Date()
  return now.toTimeString().split(" ")[0]
}
