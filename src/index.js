import ERROR_TYPE from './error-type.js'
import BaseAppError from './base-app-error.js'
import UnknownError from './errors/unknown-error.js'
import CustomError from './errors/custom-error.js'
import LogicError from './errors/logic-error.js'
import DisconnectedError from './errors/disconnected-error.js'
import BadRequestError from './errors/bad-request-error.js'
import UnauthorizedError from './errors/unauthorized-error.js'
import ForbiddenError from './errors/forbidden-error.js'
import NotFoundError from './errors/not-found-error.js'
import ConflictError from './errors/conflict-error.js'
import InternalServerError from './errors/internal-server-error.js'
import { fromAxios } from './builders/axios-error-builder.js'
import { fromSuperagent } from './builders/superagent-error-builder.js'

export {
  ERROR_TYPE,
  BaseAppError,
  UnknownError,
  CustomError,
  LogicError,
  DisconnectedError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  InternalServerError,
  fromAxios,
  fromSuperagent,
}
