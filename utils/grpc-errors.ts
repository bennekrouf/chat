import * as grpc from '@grpc/grpc-js';

export function handleGrpcError(error: any) {
  switch (error.code) {
    case grpc.status.INVALID_ARGUMENT:
      return {
        status: 400,
        message: 'Invalid arguments provided'
      };
    case grpc.status.UNAUTHENTICATED:
      return {
        status: 401,
        message: 'Authentication required'
      };
    case grpc.status.PERMISSION_DENIED:
      return {
        status: 403,
        message: 'Permission denied'
      };
    case grpc.status.NOT_FOUND:
      return {
        status: 404,
        message: 'Resource not found'
      };
    case grpc.status.DEADLINE_EXCEEDED:
      return {
        status: 504,
        message: 'Request timeout'
      };
    default:
      return {
        status: 500,
        message: 'Internal server error'
      };
  }
}
