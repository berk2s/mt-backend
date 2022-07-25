import { BodyDTO } from '@app/types/controller.types'
import { Expose } from 'class-transformer'
import { IsDefined, Length } from 'class-validator'

export class SendMessageRequest extends BodyDTO {
  @IsDefined({
    message: 'content.empty',
  })
  @Length(1, 400, {
    message: 'content.tooLong',
  })
  @Expose()
  content: string
}

export class MyChatsRequest extends BodyDTO {}
