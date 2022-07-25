/**
 * @module app.services.image
 */
import sharp from 'sharp'
import { v4 as uuidv4 } from 'uuid'
import path from 'path'

/**
 * Image Service
 * @class
 * @alias app.services.image.ImageService
 */
class ImageService {
  public readonly UPLOAD_DIR = '/public/images'

  /**
   * Resizes and saves the image
   */
  async save(buffer) {
    const filename = `${uuidv4()}.png`
    const filepath = this.filepath(filename)

    await sharp(buffer)
      .resize(300, 350, {
        fit: sharp.fit.inside,
        withoutEnlargement: true,
      })
      .toFile(filepath)

    return filename
  }

  filepath(filename) {
    return path.resolve(__dirname, `../../../../${this.UPLOAD_DIR}/${filename}`)
  }
}

export default new ImageService()
