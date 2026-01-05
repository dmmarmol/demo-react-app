type ApiErrorProps = { statusCode: number; code: string; message?: string }

export class ApiError extends Error {
    statusCode: number
    code: string

    constructor(props: ApiErrorProps) {
        super(props.message || 'An error occurred')
        this.name = 'ApiError'
        this.statusCode = props.statusCode
        this.code = props.code
    }
}

// Specific error classes
export class NotFoundError extends ApiError {
  constructor(message: string = 'Resource not found') {
    super({
        statusCode: 404, 
        code: 'NOT_FOUND', 
        message
    })
  }
}

export class ValidationError extends ApiError {
  constructor(message: string = 'Validation failed') {
    super({
        statusCode: 400, 
        code: 'VALIDATION_ERROR', 
        message
    })
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message: string = 'Unauthorized') {
    super({
        statusCode: 401, 
        code: 'UNAUTHORIZED', 
        message
    })
  }
}

export class ServerError extends ApiError {
  constructor(message: string = 'Internal server error') {
    super({
        statusCode: 500, 
        code: 'INTERNAL_ERROR', 
        message
    })
  }
}