import ERROR_TYPE from './error-type.js'
import BaseAppError from './base-app-error.js'
import HttpError from './errors/http-error.js'
import UnknownError from './errors/unknown-error.js'
import LogicError from './errors/logic-error.js'
import DisconnectedError from './errors/disconnected-error.js'
import TimeoutError from './errors/timeout-error.js'
import CanceledError from './errors/canceled-error.js'
import BadRequestError from './errors/bad-request-error.js'
import UnauthorizedError from './errors/unauthorized-error.js'
import ForbiddenError from './errors/forbidden-error.js'
import NotFoundError from './errors/not-found-error.js'
import ConflictError from './errors/conflict-error.js'
import UnprocessableEntityError from './errors/unprocessable-entity-error.js'
import TooManyRequestsError from './errors/too-many-requests-error.js'
import InternalServerError from './errors/internal-server-error.js'
import { fromAxios } from './builders/axios-error-builder.js'
import { fromSuperagent } from './builders/superagent-error-builder.js'

export {
  ERROR_TYPE,
  BaseAppError,
  HttpError,
  UnknownError,
  LogicError,
  DisconnectedError,
  TimeoutError,
  CanceledError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  UnprocessableEntityError,
  TooManyRequestsError,
  InternalServerError,
  fromAxios,
  fromSuperagent,
}
