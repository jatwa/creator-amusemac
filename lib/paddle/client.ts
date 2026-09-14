import {
  Environment,
  LogLevel,
  Paddle,
  type PaddleOptions,
} from "@paddle/paddle-node-sdk";

export function getPaddleInstance(): Paddle {
  const isProduction =
    process.env.NEXT_PUBLIC_PADDLE_ENV === "production" ||
    process.env.PADDLE_ENV === "production";

  const options: PaddleOptions = {
    environment: isProduction ? Environment.production : Environment.sandbox,
    logLevel:
      process.env.NODE_ENV === "development" ? LogLevel.verbose : LogLevel.error,
  };

  const apiKey =
    process.env.PADDLE_API_KEY ||
    process.env.PADDLE_SANDBOX_API_KEY ||
    "pdl_sdbx_apikey_placeholder";

  return new Paddle(apiKey, options);
}
