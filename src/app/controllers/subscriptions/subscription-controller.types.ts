import { BodyDTO } from '@app/types/controller.types'
import { Expose } from 'class-transformer'
import { IsDefined } from 'class-validator'

export class SubscribeRequest extends BodyDTO {
  @IsDefined({
    message: 'lookUpKey.empty',
  })
  @Expose()
  lookUpKey: string
}

export class WebhookRequest extends BodyDTO {}
