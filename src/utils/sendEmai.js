import nodemailer from 'nodemailer';
import 'dotenv/config';

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM } =
  process.env;

const nodemailerConfig = {
  host: SMTP_HOST,
  port: Number(SMTP_PORT),
  secure: false,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASSWORD,
  },
};

const transport = nodemailer.createTransport(nodemailerConfig);

export const sendEmail = (data) => {
  const email = { ...data, from: SMTP_FROM };
  return transport.sendMail(email);
};

// import nodemailer from 'nodemailer';

// import { SMTP } from '../constants/index.js';
// import { getEnvVar } from '../utils/getEnvVar.js';

// const transporter = nodemailer.createTransport({
//   host: getEnvVar(SMTP.SMTP_HOST),
//   port: Number(getEnvVar(SMTP.SMTP_PORT)),
//   auth: {
//     user: getEnvVar(SMTP.SMTP_USER),
//     pass: getEnvVar(SMTP.SMTP_PASSWORD),
//   },
// });

// export const sendEmail = async (options) => {
//   return await transporter.sendMail(options);
// };
