export class ApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data?: any;
  errors?: string[];

  constructor(
    statusCode: number,
    message: string,
    data?: any,
    success: boolean = statusCode < 400,
  ) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.success = success;
  }

  static success(
    statusCode: number = 200,
    message: string = "Success",
    data?: any,
  ) {
    return new ApiResponse(statusCode, message, data, true);
  }

  static error(
    statusCode: number = 500,
    message: string = "Internal Server Error",
    errors?: string[],
  ) {
    const response = new ApiResponse(statusCode, message, null, false);
    response.errors = errors;
    return response;
  }
}
