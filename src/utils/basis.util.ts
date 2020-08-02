import * as crypto from 'crypto';
import pyfl from 'pyfl';

export function result(
  status = true,
  message?: string,
  data?: { [key: string]: any },
) {
  return {
    success: status,
    message: message || (status ? 'success' : 'error'),
    ...data,
  };
}

export function sha1(str: string): string {
  return crypto
    .createHash('sha256')
    .update(str)
    .digest('hex');
}

export function getFirstFight(str: string): string {
  const ms = str.substr(0, 1);
  return pyfl(ms);
}

export function getLetter() {
  const arr = [];
  for(let i=0;i<25;i++) arr.push(String.fromCharCode((65+i)));
  return arr;
}

