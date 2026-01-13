import crypto from 'crypto';

export function hashContent(text: string) {
  return crypto.createHash('sha256').update(text || '').digest('hex');
}

export default { hashContent };
