import { Request } from 'express';

// TODO: Organize these files.
import { JwtPayload } from '../../infrastructure/security/strategies/index.types';

export type AuthenticationData = {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
  };
};

export type RefreshTokenData = { accessToken: string; refreshToken: string };

// TODO: Remove this and use AuthenticatedRequest.
export type JwtRequestContext = Request & { user: JwtPayload };

/**
 * Express Request generic parameters
 *
 * Request<P, ResBody, ReqBody, ReqQuery>
 *
 * ─────────────────────────────────────────────
 * P (Params)
 * ─────────────────────────────────────────────
 * Defines the shape of route parameters (`req.params`).
 *
 * Example:
 *   GET /albums/:albumId/photos/:photoId
 *
 *   type Params = {
 *     albumId: string;
 *     photoId: string;
 *   };
 *
 *   Request<Params>
 *
 * Without this, `req.params` defaults to a loose dictionary
 * and TypeScript cannot guarantee the presence of keys.
 *
 *
 * ─────────────────────────────────────────────
 * ResBody (Response Body)
 * ─────────────────────────────────────────────
 * Describes the type of the response sent via `res.json()`.
 *
 * In most NestJS/Express controllers this is intentionally
 * left as `any` because:
 * - the response is not read back from `res`
 * - response typing is usually handled at the DTO / handler level
 *
 *
 * ─────────────────────────────────────────────
 * ReqBody (Request Body)
 * ─────────────────────────────────────────────
 * Defines the payload received from the client (`req.body`).
 *
 * Commonly used for POST / PUT / PATCH routes.
 * Should be explicitly typed to avoid implicit `any`.
 *
 *
 * ─────────────────────────────────────────────
 * ReqQuery (Query Parameters)
 * ─────────────────────────────────────────────
 * Defines the shape of the query string (`req.query`).
 *
 * Note:
 * - Query params are always strings (or undefined) at runtime
 * - Parsing / transformation should happen explicitly
 *
 *
 * ─────────────────────────────────────────────
 * AuthenticatedRequest
 * ─────────────────────────────────────────────
 * Extends Express Request with authenticated user data,
 * injected by the authentication layer (JWT strategy).
 *
 * Defaults are intentionally explicit to avoid silent `any`s
 * and improve readability at controller/guard boundaries.
 */
export type AuthenticatedRequest<
  P = Record<string, string>,
  B = unknown,
  Q = Record<string, string>,
> = Request<P, any, B, Q> & {
  user: JwtPayload;
};
