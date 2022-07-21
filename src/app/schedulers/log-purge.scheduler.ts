/**
 * @module app.schedulers
 */

import schedule from 'node-schedule'
import fs from 'fs'
import { DateUtility } from '@app/utilities/date-utility'
import loggerService from '@app/services/logger/logger-service'

/**
 * Purges unnecessary logs
 * Works every day at 00:00
 */
schedule.scheduleJob('* * */23 * * *', () => {
  fs.readdir('./logs', (err: any, files: any) => {
    if (err) {
      loggerService.error(err)
      return
    }

    files.forEach(purgeUnnecessaryLogFiles)
  })
})

const purgeUnnecessaryLogFiles = (fileName: any) => {
  if (
    typeof fileName === 'string' &&
    fileName.endsWith('.log') &&
    fileName.startsWith('application')
  ) {
    const actualName = fileName.split('.')[0]
    const splittedArr = actualName.split('-')

    const today = new Date()
    const oneWeekAgo = new Date(today.setDate(today.getDate() - 6))

    if (splittedArr.length === 4) {
      const dateOfdayArr = [...splittedArr.filter((i) => i !== 'application')]

      const date = new Date(new Date(dateOfdayArr.join('-')).setHours(23))

      // This piece of code deletes log file if older than seven day
      if (DateUtility.findDaysDifference(date, oneWeekAgo) > 7) {
        fs.unlink(`./logs/${fileName}`, deletedFileCallBack(fileName))
      }
    }
  }
}

const deletedFileCallBack = (fileName: any) => (err: any) => {
  if (err) {
    loggerService.error(err)
    return
  }

  loggerService.info(
    'Log file which is older than 7 day has been deleted [fileName: {}]',
    fileName,
  )
}
