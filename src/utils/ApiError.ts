export class ApiError extends Error {
    public statusCode:number
    public errors: unknown[]
    public isOperational: boolean

    constructor(
        statusCode: number,
        message:string,
        errors: unknown[]=[],
        isOperational = true
    ){
        super(message)
        this.statusCode =statusCode
        this.errors =errors
        this.isOperational =isOperational

        Error.captureStackTrace(this, this.constructor)
    }
}