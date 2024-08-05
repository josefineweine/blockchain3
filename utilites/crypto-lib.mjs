import crypto from 'crypto';

export const createHash = (data) => {
  return crypto.createHash('sha256').update(data).digest('hex');
};