export function padTime(time: number): string {
  return time < 10 ? `0${time}` : `${time}`
}

export function formatTime(time: number): string {
  const t = Math.max(0, time)
  return `${padTime(Math.floor(t / 60))} : ${padTime(t % 60)}`
}
