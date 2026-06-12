class ServerError extends Error {
  status: number;

  constructor(status: number, message: string, stack?: string) {
    super(message);
    this.name = "ServerError"; // ✅ clearer error type
    this.status = status;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ServerError;