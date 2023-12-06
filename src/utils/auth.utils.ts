import { UserTokens } from "../interfaces/auth.interface";
import jwt from "jsonwebtoken";
import crypto from "crypto-js";

const ONE_DAY_IN_SECONDS = 24 * 60 * 60;
const ONE_MONTH_IN_SECONDS = 30 * 24 * 60 * 60;

export function createUserToken(user): UserTokens {
  const accessKey = process.env.ACCESS_KEY_SECRET;
  const refreshKey = process.env.REFRESH_KEY_SECRET;

  if(user.exp) {
    delete user.exp;
  }

  const accessToken = jwt.sign(user, accessKey, {
    expiresIn: ONE_DAY_IN_SECONDS,
  });
  const refreshToken = jwt.sign(user, refreshKey, {
    expiresIn: ONE_MONTH_IN_SECONDS,
  });

  return {
    accessToken,
    refreshToken,
    expires: ONE_DAY_IN_SECONDS,
  };
}

export function encryptPassword(password: string) {
  const salt = crypto.lib.WordArray.random(16).toString();

  const hashedPassword = crypto.PBKDF2(password, salt, {
    keySize: 64,
    iterations: 1000,
  }).toString();

  return { salt, hashedPassword };
};

export function authenticatePassword(password: string, salt: string, hashedPassword: string) {
  const passwordToAuth = crypto.PBKDF2(password, salt, {
    keySize: 64,
    iterations: 1000,
  }).toString();

  return passwordToAuth === hashedPassword;
}

