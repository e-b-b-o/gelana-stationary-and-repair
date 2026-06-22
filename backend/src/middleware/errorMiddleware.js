import { ZodError } from "zod";

export default function errorMiddleware(err, req, res, next) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      status: "fail",
      errors: err.issues,
    });
  }
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
}
