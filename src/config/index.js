const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    APP_NAME: Joi.string().required().description('Application name'),
    API_HOST: Joi.string().required().description('Application API Endpoint'),
    UI_HOST: Joi.string().required().description('Application UI Endpoint'),
    PORT: Joi.number().default(3000),
    MONGODB_URL: Joi.string().required().description('Mongo DB url'),
    JWT_SECRET: Joi.string().required().description('JWT secret key'),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30).description('minutes after which access tokens expire'),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const environment = envVars.NODE_ENV;

const config = {
  env: environment,
  is_production: environment === 'production',
  is_development: environment === 'development',
  is_test: environment === 'test',
  app_name: envVars.APP_NAME,
  api_host: envVars.API_HOST,
  ui_host: envVars.UI_HOST,
  port: envVars.PORT,
  mongoose: {
    url: envVars.MONGODB_URL + (environment === 'test' ? '-test' : ''),
    options: {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      keepAlive: true,
    },
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
  },
};

module.exports = config;
