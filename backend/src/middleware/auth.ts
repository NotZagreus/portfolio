// import { auth } from "express-oauth2-jwt-bearer";
// import dotenv from "dotenv";
// import { Request, Response, NextFunction } from "express";

// dotenv.config();

// const checkJwt = auth({
//   audience: 'https://artemk-portfolio.com',
//   issuerBaseURL: 'https://dev-k4fhctws467co87d.us.auth0.com/',
//   tokenSigningAlg: 'RS256',
// });

// const checkPermissions = () => {
//   return (req: Request, res: Response, next: NextFunction) => {
//     const auth = req.auth as { payload?: { permissions?: string[] } } | undefined;
//     const permissions = auth?.payload?.permissions || [];

//     if (!permissions.includes("manage:portfolio")) {
//       res.status(403).json({ message: `Forbidden: You don't have access to manage the portfolio. Auth object: ${JSON.stringify(auth)}` });
//       return;
//     }

//     next();
//   };
// };

// export { checkJwt, checkPermissions };

import { auth } from 'express-oauth2-jwt-bearer';
import dotenv from 'dotenv';
import { Request, Response, NextFunction } from 'express';

dotenv.config();

const checkJwt = auth({
  audience: 'https://artemk-portfolio.com',
  issuerBaseURL: 'https://dev-k4fhctws467co87d.us.auth0.com/',
  tokenSigningAlg: 'RS256',
});

const checkPermissions = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    const auth = req.auth as { payload?: { permissions?: string[] } } | undefined;
    const permissions = auth?.payload?.permissions || [];

    if (!permissions.includes('manage:portfolio')) {
      res.status(403).json({ message: `Forbidden: You don't have access to manage the portfolio.` });
      return;
    }

    next();
  };
};

export { checkJwt, checkPermissions };