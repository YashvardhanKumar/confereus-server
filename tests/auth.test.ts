import UserService from '../services/user.services';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

describe('Auth & Token Services', () => {
  beforeAll(() => {
    if (!process.env.PRIVATE_KEY) {
      const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: { type: 'spki', format: 'pem' },
        privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
      });
      process.env.PRIVATE_KEY = privateKey;
      process.env.PUBLIC_KEY = publicKey;
    }
  });

  it('generates and verifies RS256 JWT tokens using RSA keys', () => {
    const payload = { email: 'test@confereus.com', userId: '12345' };
    const token = UserService.generateToken(payload, 3600);
    
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');

    const decoded: any = UserService.verifyToken(token as string);
    expect(decoded).toBeDefined();
    expect(decoded.email).toBe(payload.email);
    expect(decoded.userId).toBe(payload.userId);
  });

  it('rejects invalid or tampered tokens', () => {
    let errorHandlerCalled = false;
    const result = UserService.verifyToken('invalid.token.here', () => {
      errorHandlerCalled = true;
    });
    expect(errorHandlerCalled).toBe(true);
    expect(result).toBeInstanceOf(Error);
  });

  it('hashes passwords and verifies match', async () => {
    const rawPassword = 'supersecretpassword123';
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(rawPassword, salt);

    const isMatch = await bcrypt.compare(rawPassword, hash);
    const isWrongMatch = await bcrypt.compare('wrongpassword', hash);

    expect(isMatch).toBe(true);
    expect(isWrongMatch).toBe(false);
  });
});
