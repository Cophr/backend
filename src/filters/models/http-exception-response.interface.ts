export interface CustomHttpExceptionResponse {
  statusCode: number;
  error: string;
  path: string;
  method: string;
  timeStamp: Date;
}
