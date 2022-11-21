export default () => ({
  port: parseInt(process.env.PORT, 10) || 8443,
  database: {
    host: process.env.DATABASE_HOST || 'mongodb://localhost:27017/scamdb',
  },
  jwt: {
    secret: process.env.JWT_SECRET_KEY || 'secret',
    expiary: process.env.JWT_EXPIARY || '2h',
  },
  url: {
    scam: process.env.SCAM_URL || 'http://138.68.81.194:5495',
    fe: process.env.FE_URL || 'http://localhost:3000',
  },
  mailserver: {
    /* goto: https://ethereal.email/login to generate test user and password */
    host: process.env.MAILSERVER_HOST || 'smtp.ethereal.email',
    port: process.env.MAILSERVER_PORT || 587,
    user: process.env.MAILSERVER_USER || 'garland.wolff@ethereal.email',
    password: process.env.MAILSERVER_PASSWORD || 'a1C4sGj9HG5qEJzZbn',
    mailFrom: process.env.MAILSERVER_FROM || 'no-reply@scamreport.com',
  }
});