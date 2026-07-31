class ApiResponse {
  constructor(statusCode, message, data = null, pagination = null) {
    this.success = statusCode >= 200 && statusCode < 300;
    this.message = message;
    this.data = data;
    if (pagination) this.pagination = pagination;
  }

  static success(res, message, data = null, statusCode = 200, pagination = null) {
    return res.status(statusCode).json(new ApiResponse(statusCode, message, data, pagination));
  }

  static created(res, message, data = null) {
    return ApiResponse.success(res, message, data, 201);
  }

  static paginated(res, message, data, page, limit, total) {
    const pagination = {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
    return ApiResponse.success(res, message, data, 200, pagination);
  }
}

export default ApiResponse;
