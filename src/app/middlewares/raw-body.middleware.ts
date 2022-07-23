/**
 * @module app.middlewares
 */

/*
 * Adds raw body field to the request
 */
export const rawBodySaver = (req: any, res: any, buf: any, encoding: any) => {
  if (buf && buf.length) {
    req.rawBody = buf.toString(encoding || 'utf8')
  }
}
