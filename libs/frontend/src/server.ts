import { createServer, Response } from "miragejs";

export function makeServer() {
  let server = createServer({
    routes() {
      this.passthrough()
      
      this.get("/api/test/test", (schema, request) => {
        return new Response(200, {}, {})
      });
    }
  });
  return server
}