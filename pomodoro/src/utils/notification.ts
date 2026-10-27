export const notificationsSupported = () => typeof Notification !== 'undefined'

export function requestNotifications(): Promise<boolean> {
  if (!notificationsSupported()) return Promise.resolve(false)
  return Promise.resolve(Notification.requestPermission()).then(
    (p) => p === 'granted',
    () => false
  )
}

export function notify(body: string) {
  if (!notificationsSupported() || Notification.permission !== 'granted') return
  try {
    const n = new Notification('Pomodo', {
      icon: `${import.meta.env.BASE_URL}assets/img/icon.png`,
      body,
    })
    setTimeout(() => n.close(), 5000)
  } catch (e) {
    console.error('Error: Creating notification', e)
  }
}

export function playSound() {
  const audio = new Audio(`${import.meta.env.BASE_URL}assets/audio/notification.mp3`)
  audio.play().catch(() => undefined)
}
