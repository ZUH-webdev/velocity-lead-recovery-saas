declare module 'passport' {
  import { Request, Response, NextFunction } from 'express'
  
  interface AuthenticateOptions {
    session?: boolean
    scope?: string[]
    failureRedirect?: string
  }

  function initialize(): (req: Request, res: Response, next: NextFunction) => void
  function authenticate(strategy: string, options?: AuthenticateOptions, callback?: Function): any
  function authenticate(strategy: string, callback?: Function): any
  function use(strategy: any): any
  function serializeUser(fn: Function): void
  function deserializeUser(fn: Function): void

  export = passport
  const passport: {
    initialize: typeof initialize
    authenticate: typeof authenticate
    use: typeof use
    serializeUser: typeof serializeUser
    deserializeUser: typeof deserializeUser
  }
}

declare module 'passport-google-oauth20' {
  import { Request } from 'express'
  
  interface Profile {
    id: string
    displayName: string
    name?: {
      givenName?: string
      familyName?: string
    }
    emails?: Array<{ value: string; verified?: boolean }>
    photos?: Array<{ value: string }>
    provider: string
  }

  interface StrategyOptions {
    clientID: string
    clientSecret: string
    callbackURL: string
    scope?: string[]
  }

  type VerifyCallback = (error: any, user?: any, info?: any) => void
  
  type VerifyFunction = (
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback
  ) => void

  class Strategy {
    constructor(options: StrategyOptions, verify: VerifyFunction)
    name: string
  }

  export { Strategy, Profile, StrategyOptions }
}