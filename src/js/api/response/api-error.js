import MessageCode from "@/js/api/response/message-code";

class ExtendableError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    // 保持完整的错误堆栈追踪
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

class ApiError extends ExtendableError {
  constructor(message, code, data) {
    super(message);
    this.code = code;
    if (data) {
      this.data = data;
    }
  }

  isUnassignedRole() {
    return this.code === MessageCode.Unassigned_Role;
  }
}

export default ApiError;
