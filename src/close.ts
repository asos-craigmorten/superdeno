// deno-lint-ignore-file no-explicit-any
import type { Listener, RequestHandler, Server } from "./types.ts";

/**
 *
 * @param {Server} server
 * @param {string|RequestHandler|Listener|Server} app
 * @param {?Error} err
 * @param {?Function} callback
 * @private
 */
export const close = async (
  server: Server,
  app: string | RequestHandler | Listener | Server,
  serverErr?: any,
  callback?: (serverErr: any, error: any) => any,
) => {
  let error;

  if (server) {
    try {
      await server.close();
    } catch (err) {
      // Server might have been already closed
      if (!(err instanceof Deno.errors.BadResource)) {
        error = err;
      }
    }
  }

  if (serverErr) {
    console.error(
      "SuperDeno experienced an unexpected server error",
      serverErr,
    );
  }
  if (error) {
    console.error(
      "SuperDeno experienced an unexpected error closing the server",
      error,
    );
  }

  if (app && typeof (app as any).emit === "function") {
    (app as any).emit("close", [serverErr, error]);
  }

  if (typeof callback === "function") return await callback(serverErr, error);
};
