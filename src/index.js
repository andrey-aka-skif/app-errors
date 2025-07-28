import ERROR_TYPE from './error-type'
import BaseAppError from './base-app-error'
import UnknownError from './errors/unknown-error'
import CustomError from './errors/custom-error'
import LogicError from './errors/logic-error'
import DisconnectedError from './errors/disconnected-error'
import BadRequestError from './errors/bad-request-error'
import UnauthorizedError from './errors/unauthorized-error'
import ForbiddenError from './errors/forbidden-error'
import NotFoundError from './errors/not-found-error'
import ConflictError from './errors/conflict-error'
import InternalServerError from './errors/internal-server-error'
import { fromAxios } from './builders/axios-error-builder'
import { fromSuperagent } from './builders/superagent-error-builder'

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
