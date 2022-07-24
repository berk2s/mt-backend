/**
 * @module app.middlewares
 */

/*
 * Adds raw body field to the request
 */
export const rawBodySaver = (req: any, res: any, buf: any, encoding: any) => {
  if (
    req.headers['content-type'] &&
    req.headers['content-type'].startsWith('multipart/form-data')
  ) {
    console.log('here')
    return
  }
  if (buf && buf.length) {
    req.rawBody = buf.toString(encoding || 'utf8')
  }
}
