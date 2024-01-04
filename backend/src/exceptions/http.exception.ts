/**
 * HttpException class
 */
export class HttpException extends Error {
  /**
   * Constructor
   *
   * @param statusCode
   * @param message
   */
  constructor(
    public readonly statusCode: number,
    public readonly message: string
  ) {
    super(message);
  }
}
