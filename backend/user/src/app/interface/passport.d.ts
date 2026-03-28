declare module 'passport' {
  import { Request } from 'express';
  interface AuthenticateOptions {
    session?: boolean;
    failureRedirect?: string;
    scope?: string | string[];
  }
  interface AuthenticateCallback {
    (err: Error | null | undefined, user?: unknown, info?: { message?: string }): void;
  }
  interface PassportStatic {
    use(strategy: unknown): this;
    authenticate(
      strategy: string,
      optionsOrCallback?: AuthenticateOptions | AuthenticateCallback,
      callback?: AuthenticateCallback
    ): (req: Request, res: unknown, next: (err?: Error) => void) => void;
    initialize(): (req: Request, res: unknown, next: (err?: Error) => void) => void;
  }
  const passport: PassportStatic;
  export default passport;
}

declare module 'passport-local' {
  interface IStrategyOptions {
    usernameField?: string;
    passwordField?: string;
    passReqToCallback?: boolean;
  }
  interface VerifyFunction {
    (req: unknown, username: string, password: string, done: (err: Error | null, user?: unknown, options?: { message?: string }) => void): void;
  }
  class Strategy {
    constructor(options: IStrategyOptions, verify: VerifyFunction);
  }
}

declare module 'passport-google-oauth20' {
  interface StrategyOptions {
    clientID: string;
    clientSecret: string;
    callbackURL: string;
  }
  interface Profile {
    id: string;
    displayName?: string;
    emails?: { value: string }[];
    photos?: { value: string }[];
  }
  type VerifyCallback = (err: Error | null, user?: unknown) => void;
  class Strategy {
    constructor(options: StrategyOptions, verify: (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => void);
  }
}

declare module 'passport-facebook' {
  interface StrategyOptions {
    clientID: string;
    clientSecret: string;
    callbackURL: string;
    profileFields?: string[];
  }
  interface Profile {
    id: string;
    displayName?: string;
    emails?: { value: string }[];
    photos?: { value: string }[];
  }
  type VerifyCallback = (err: Error | null, user?: unknown) => void;
  class Strategy {
    constructor(options: StrategyOptions, verify: (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => void);
  }
}
