import moment from 'moment'

/**
 * Provides a style based on how long since the device was last turned on
 * @returns styling for the urgency that it needs to be turned on to save phone credit
 */
export const needsToTurnOn = (item) => {
  if (item.model && item.model !== 'SmartPhone') {
    const over50Days = moment(item.lastUpdate).add(50, 'days').isBefore(moment())
    const over65Days = moment(item.lastUpdate).add(65, 'days').isBefore(moment())
    if (over65Days) {
      return 'rgba(250, 0, 0, 0.25)'
    }
    if (over50Days) {
      return 'rgba(255, 186, 10, 0.25)'
    }
  }
  return undefined
}

export const daysSinceLastTurnOn = (item) => {
  const today = moment()
  const lastUpdate = moment(item.lastUpdate)
  return today.diff(lastUpdate, 'days')
}
