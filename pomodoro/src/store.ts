export const WORK_TIME = 1500
export const BREAK_TIME = 300
export const LONG_BREAK_TIME = 900
export const MAX_COUNT = 4

export interface State {
  time: number // seconds remaining
  count: number // completed work sessions
  isBreak: boolean
  isActive: boolean
  endAt: number // epoch ms when running timer finishes
}

export type Action =
  | { type: 'TOGGLE'; now: number }
  | { type: 'RESET' }
  | { type: 'TICK'; now: number }

export const initialState: State = {
  time: WORK_TIME,
  count: 0,
  isBreak: false,
  isActive: false,
  endAt: 0,
}

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'TOGGLE':
      return state.isActive
        ? { ...state, isActive: false, endAt: 0 }
        : { ...state, isActive: true, endAt: action.now + state.time * 1000 }
    case 'TICK': {
      if (!state.isActive) return state
      const time = Math.max(0, Math.round((state.endAt - action.now) / 1000))
      if (time > 0) return time === state.time ? state : { ...state, time }
      if (state.isBreak) {
        const finale = state.count >= MAX_COUNT
        return {
          ...state,
          isActive: false,
          endAt: 0,
          isBreak: false,
          count: finale ? 0 : state.count,
          time: WORK_TIME,
        }
      }
      const count = state.count + 1
      return {
        ...state,
        isActive: false,
        endAt: 0,
        isBreak: true,
        count,
        time: count >= MAX_COUNT ? LONG_BREAK_TIME : BREAK_TIME,
      }
    }
    case 'RESET':
      return initialState
  }
}
