import * as Joi from 'joi';

export class EnvHelper {
  static determineEnvFilePath(): string {
    const env = process.env.NODE_ENV || 'local';
    const envs = {
      local: '.env.local',
      development: '.env.development',
      production: '.env.production',
      staging: '.env.staging',
      test: '.env.test',
    };
    const envFilePath = envs[env];
    return envFilePath;
  }

  static validationSchema(): Joi.ObjectSchema<any> {
    return Joi.object({
      NODE_ENV: Joi.string()
        .valid('local', 'development', 'production', 'staging', 'test')
        .default('local'),
      PORT: Joi.number().default(8080),
      MONGO_URI: Joi.string().required(),
    });
  }
}
