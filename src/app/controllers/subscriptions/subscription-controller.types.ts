import { BodyDTO } from '@app/types/controller.types'
import { Expose } from 'class-transformer'
import { IsDefined } from 'class-validator'

export class SubscribeRequest extends BodyDTO {
  @IsDefined({
    message: 'packageName.empty',
  })
  @Expose()
  packageName: string
}

export class WebhookRequest extends BodyDTO {}

export class UnsubscribeRequest extends BodyDTO {
  @IsDefined({
    message: 'packageName.empty',
  })
  @Expose()
  packageName: string
}
