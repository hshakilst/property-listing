import * as Joi from 'joi';

export class EnvHelper {
  static validationSchema(): Joi.ObjectSchema<any> {
    return Joi.object({
      NODE_ENV: Joi.string()
        .valid('local', 'development', 'production', 'staging', 'test')
        .default('local'),
      PORT: Joi.number().default(8080),
      MONGO_URI: Joi.string().required(),
      AWS_REGION: Joi.string().required(),
      AWS_ACCESS_KEY_ID: Joi.string().required(),
      AWS_SECRET_ACCESS_KEY: Joi.string().required(),
      AWS_S3_BUCKET_NAME: Joi.string().required(),
      PUBLIC_IMAGE_STORAGE_PATH: Joi.string().required(),
    });
  }

  static getMongoDbUri(): string {
    return process.env.MONGO_URI;
  }
}
