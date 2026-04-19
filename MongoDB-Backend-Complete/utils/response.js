/**
 * Response Handler Utility
 * Standardizes API responses across the application
 */

export class ApiResponse {
  static success(data, message = 'Success', statusCode = 200) {
    return {
      success: true,
      statusCode,
      message,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  static error(message = 'Error', statusCode = 500, errors = null) {
    return {
      success: false,
      statusCode,
      message,
      errors,
      timestamp: new Date().toISOString(),
    };
  }

  static paginated(data, total, page, limit) {
    return {
      success: true,
      message: 'Data retrieved successfully',
      data,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
      timestamp: new Date().toISOString(),
    };
  }
}

export default ApiResponse;
