import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { paymentMiddleware } from "x402-hono";

const app = new Hono();

app.use(
  paymentMiddleware(
    `0x74cece8c927587620ff5171ced3fa852185252a2`,
    {
      "/knowledge": {
        price: "0.001",
        network: "base-sepolia",
        config: {
          description: "Access to 33rd degree Freemason Knowledge",
        },
      },
    },
    {
      url: "https://x402.org/facilitator", //testnet
    },
  ),
);

app.get("/knowledge", (c) => {
  return c.json({
    message: `hello you payed to see me here right`,
    answer: ``,
  });
});

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`server is running at http://localhost:${info.port}`);
  },
);
