import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class EnumValidationPipe implements PipeTransform {
  constructor(private readonly allowedValues: string[]) {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async transform(value: string, metadata: ArgumentMetadata) {
    if (!value)
      throw new BadRequestException(
        'Validation Failed: Enum value cannot be empty.',
      );
    if (!this.allowedValues.includes(value))
      throw new BadRequestException(
        `Validation Failed: Enum value should be: ${this.allowedValues.join(
          ', ',
        )}.`,
      );
    return value;
  }
}
