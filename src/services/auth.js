import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import Handlebars from 'handlebars';
import jwt from 'jsonwebtoken';

import UsersCollection from '../db/models/User.js';
import SessionCollection from '../db/models/Session.js';
import { sendEmail } from '../utils/sendEmai.js';
import { getEnvVar } from '../utils/getEnvVar.js';
import {
  accessTokenLifetime,
  refreshTokenLifetime,
} from '../constants/users.js';
import { TEMPLATES_DIR } from '../constants/index.js';
const createSessionData = () => ({
  accessToken: randomBytes(30).toString('base64'),
  refreshToken: randomBytes(30).toString('base64'),
  accessTokenValidUntil: Date.now() + accessTokenLifetime,
  refreshTokenValidUntil: Date.now() + refreshTokenLifetime,
});

const emailTemplatePath = path.join(TEMPLATES_DIR, 'verify-email.html');
const emailTemplateSourse = await readFile(emailTemplatePath, 'utf-8');
const appDomain = getEnvVar('APP_DOMAIN');
const jwtSecret = getEnvVar('JWT_SECRET');

export const register = async (payload) => {
  const { email, password } = payload;
  const user = await UsersCollection.findOne({ email });
  if (user) {
    throw createHttpError(409, 'Email in use');
  }
  const hashPassword = await bcrypt.hash(password, 10);
  const newUser = await UsersCollection.create({
    ...payload,
    password: hashPassword,
  });

  const template = Handlebars.compile(emailTemplateSourse);

  const token = jwt.sign({ email }, jwtSecret, { expiresIn: '1h' });

  const html = template({ link: `${appDomain}/auth/verify?token=${token}` });

  const verifyEmail = {
    to: email,
    subject: 'Verify email',
    html,
  };

  await sendEmail(verifyEmail);

  return newUser;
};

export const verify = async (token) => {
  try {
    const { email } = jwt.verify(token, jwtSecret);
    const user = await UsersCollection.findOne({ email });
    if (!user) {
      throw createHttpError(401, 'User not found');
    }
    await UsersCollection.findOneAndUpdate({ _id: user._id }, { verify: true });
  } catch (error) {
    throw createHttpError(401, error.message);
  }
};

export const requestResetToken = async (email) => {
  const user = await UsersCollection.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  //доповнимо її трохи пізніше

  const resetToken = jwt.sign(
    {
      sub: user._id,
      email,
    },
    jwtSecret,
    {
      expiresIn: '15m',
    },
  );

  const resetLink = `${appDomain}/reset-password?token=${resetToken}`;

  await sendEmail({
    from: getEnvVar('SMTP_FROM'),
    to: email,
    subject: 'Reset your password',
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password!</p>`,
  });
};

export const resetPassword = async (payload) => {
  let entries;

  try {
    entries = jwt.verify(payload.token, jwtSecret);
  } catch (err) {
    if (err instanceof Error) throw createHttpError(401, err.message);
    throw err;
  }

  const user = await UsersCollection.findOne({
    email: entries.email,
    _id: entries.sub,
  });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  await UsersCollection.updateOne(
    { _id: user._id },
    { password: encryptedPassword },
  );
};

export const login = async ({ email, password }) => {
  const user = await UsersCollection.findOne({ email });

  if (!user) {
    throw createHttpError(401, 'Email or password is invalid');
  }
  if (!user.verify) {
    throw createHttpError(401, 'Email is not verified');
  }
  const passwordCompare = await bcrypt.compare(password, user.password);

  if (!passwordCompare) {
    throw createHttpError(401, 'Email or password is invalid');
  }

  await SessionCollection.deleteOne({ userId: user._id });

  const sessionData = createSessionData();

  return SessionCollection.create({
    userId: user._id,
    ...sessionData,
  });
};

export const refreshToken = async (payload) => {
  const oldSession = await SessionCollection.findOne({
    _id: payload.sessionId,
    refreshToken: payload.refreshToken,
  });
  if (!oldSession) {
    throw createHttpError(401, 'Session is not found');
  }
  if (Date.now() > oldSession.refreshTokenValidUntil) {
    throw createHttpError(401, 'Refresh token is expired');
  }

  await SessionCollection.deleteOne({ _id: payload.sessionId });

  const sessionData = createSessionData();

  return SessionCollection.create({
    userId: oldSession.userId,
    ...sessionData,
  });
};

export const logout = async (sessionId) => {
  await SessionCollection.deleteOne({ _id: sessionId });
};

export const getUser = (filter) => UsersCollection.findOne(filter);

export const getSession = (filter) => SessionCollection.findOne(filter);
