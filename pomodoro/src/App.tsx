import { useCallback, useEffect, useReducer, useState } from 'react'
import Keybindings from './components/footer/Keybindings'
import Notifications from './components/footer/Notifications'
import Code from './components/footer/Code'
import Steps from './components/Steps'
import Cta from './components/Cta'
import { formatTime } from './utils/time'
import { notificationsSupported, notify, playSound, requestNotifications } from './utils/notification'
import { initialState, MAX_COUNT, reducer, State } from './store'

const STORAGE_KEY = 'pomodoro-state'

function load(): State {
  try {
    const s = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null') as State | null
    if (s && typeof s.time === 'number') {
      return s
    }
  } catch {
    /* ignore corrupt state */
  }
  return initialState
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, undefined, load)
  const { time, isBreak, count, isActive } = state
  const [notifications, setNotifications] = useState(
    notificationsSupported() && Notification.permission === 'granted'
  )

  const onStart = useCallback(() => dispatch({ type: 'TOGGLE', now: Date.now() }), [])
  const onReset = useCallback(() => dispatch({ type: 'RESET' }), [])
  const askNotifications = useCallback(() => {
    requestNotifications().then(setNotifications)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault()
        onStart()
      } else if (e.code === 'KeyR') onReset()
    }
    window.addEventListener('keyup', onKey)
    return () => window.removeEventListener('keyup', onKey)
  }, [onStart, onReset])

  useEffect(() => {
    if (notificationsSupported() && Notification.permission === 'default') askNotifications()
  }, [askNotifications])

  useEffect(() => {
    if (!isActive) return
    const id = setInterval(() => dispatch({ type: 'TICK', now: Date.now() }), 250)
    return () => clearInterval(id)
  }, [isActive])

  useEffect(() => {
    document.title = formatTime(time)
  }, [time])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  // Fire the alert when a phase finishes (running -> stopped with a fresh phase)
  const [prev, setPrev] = useState({ isBreak, isActive })
  useEffect(() => {
    if (prev.isActive && !isActive && prev.isBreak !== isBreak) {
      notify(`${prev.isBreak ? 'Break' : 'Work'} has ended, time to ${prev.isBreak ? 'work' : 'relax'}!`)
      playSound()
    }
    setPrev({ isBreak, isActive })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBreak, isActive])

  return (
    <div className={`container${isBreak ? ' is-break' : ''}`}>
      <div>
        <div className="box">
          <div className="timer">{formatTime(time)}</div>
          <Cta title={isActive ? 'Pause' : isBreak ? 'Break' : 'Work'} onClick={onStart} />
          <Cta title="Reset" onClick={onReset} />
          <Steps current={count} max={MAX_COUNT} />
        </div>

        <div className="links hide-mobile">
          <div className="link">
            <Keybindings />
          </div>
          <span className="spacer">|</span>
          <Notifications notifications={notifications} onClick={askNotifications} />
          <Code />
        </div>
      </div>
    </div>
  )
}
