// YYYY-MM-DD of today
import {loadSlots} from '../services/requests'
 
const eventGuid = 0
const todayStr = new Date().toISOString().replace(/T.*$/, '')

export const INITIAL_EVENTS = [
  {
    id: createEventId(),
    title: 'All-day event',
    start: todayStr
  },
  {
    id: createEventId(),
    title: 'Timed event',
    start: `${todayStr  }T12:00:00.000Z`
  },

  {
    id: createEventId(),
    title: 'Solot',
    start: `${todayStr  }T12:00:00.000Z`
  }
]

export function createEventId() {
  return String(eventGuid+1)
}


export function handleEvents(slots) {
  const events = slots.map((slot) => ({
      id: slot.id,
      title: slot.name,
      start: new Date(slot.data_hora).toISOString()
    }))
  return events;
}
