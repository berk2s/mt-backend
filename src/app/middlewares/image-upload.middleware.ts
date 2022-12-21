/**
 * @module app.middlewares
 */

import loggerService from '@app/services/logger/logger-service'
import multer from 'multer'

/**
 * Configures some restrictions
 */
const uploadMiddleware = multer({
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (req: any, file: any, callBack: any) => {
    if (
      file.mimetype === 'image/jpeg' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/png'
    ) {
      callBack(null, true)
    } else {
      loggerService.warn('Invalid mime type')
      callBack(null, false)
    }
  },
})

export default uploadMiddleware
