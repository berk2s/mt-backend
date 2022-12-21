import { BodyDTO } from '@app/types/controller.types'
import { Expose } from 'class-transformer'
import { IsDefined, Length, Min } from 'class-validator'

export class SubscribeRequest extends BodyDTO {
  @IsDefined({
    message: 'foreginRef.empty',
  })
  @Expose()
  foreginRef: string
}

export class WebhookRequest extends BodyDTO {}

export class UnsubscribeRequest extends BodyDTO {
  @IsDefined({
    message: 'foreginRef.empty',
  })
  @Expose()
  foreginRef: string
}

export class CreatePremiumPackageRequest extends BodyDTO {
  @IsDefined({
    message: 'packageName.empty',
  })
  @Length(1, 100, {
    message: 'packageName.invalid',
  })
  @Expose()
  packageName: string

  @IsDefined({
    message: 'packageDescription.empty',
  })
  @Length(1, 100, {
    message: 'packageDescription.invalid',
  })
  @Expose()
  packageDescription: string

  @IsDefined({
    message: 'productPrice.empty',
  })
  @Min(1, {
    message: 'productPrice.invalid',
  })
  @Expose()
  unitAmonut: number

  @IsDefined({
    message: 'currency.empty',
  })
  @Expose()
  currency: string

  @IsDefined({
    message: 'subscriptionInterval.empty',
  })
  @Expose()
  subscriptionInterval: string

  @IsDefined({
    message: 'likeLimit.empty',
  })
  @Min(1, {
    message: 'likeLimit.invalid',
  })
  @Expose()
  likeLimit: number

  @IsDefined({
    message: 'canSeePersonalTrainers.empty',
  })
  @Expose()
  canSeePersonalTrainers: boolean
}
