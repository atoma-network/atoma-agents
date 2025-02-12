import dotenv from 'dotenv';
dotenv.config();

export default {
  env: process.env.ENVIRONMENT || 'development',
  port: process.env.PORT || 2512,
  encryption: {
    secretKey: process.env.SECRET_KEY || '',
    algorithm: process.env.ENCRYPTION_ALGO || 'aes-256-cbc',
    encoding: process.env.encoding || 'base64'
  },
  auth: {
    atomaSdkBearerAuth: process.env.ATOMASDK_BEARER_AUTH || ''
  }
};
