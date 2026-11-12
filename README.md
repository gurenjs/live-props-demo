# Guren live props demo

A kitchen board and an order tracking page that stay in step with no polling and no refresh. Built with [Guren](https://github.com/gurenjs/guren) on Bun, using Inertia live props.


https://github.com/user-attachments/assets/3c07c0ae-afd3-492b-91b4-60902dfec914


The kitchen marks an order ready in one window. The customer's page in the other window changes by itself.

## Run it

You need [Bun](https://bun.sh) 1.3 or later.

```bash
git clone https://github.com/gurenjs/live-props-demo.git
cd live-props-demo
bun install
cp .env.example .env
bun run db:migrate
bun run dev
```

Open two browser windows:

- `http://localhost:3333` is the kitchen board.
- `http://localhost:3333/orders/2` is the page one customer sees.

Click **Start cooking** on the Katsu curry row. The other window moves to "Your order is on the stove." without a reload. **Reset** on the board puts the four seeded orders back.

## How it works

Four files hold the whole feature.

| File | What it does |
|---|---|
| `app/Events/OrderUpdated.ts` | Names the event and the channel it is sent on, `orders.<id>` |
| `app/Http/Controllers/OrderController.ts` | Wraps the prop: `live(order, { on: new OrderUpdated(order.id) })`, and broadcasts the event when an order changes |
| `routes/web.ts` | Mounts the WebSocket route the browser subscribes over |
| `resources/js/app.tsx` | Passes `live: liveTransport()` to the Inertia client |

The React pages under `resources/js/pages/orders/` have no socket code. A live prop arrives as an ordinary prop.

When the kitchen changes an order, the server broadcasts `OrderUpdated` with the order's id. Every browser showing that order receives it and asks the server for the `order` prop again, with an Inertia partial reload. The event carries only the id. The new value comes from the controller, through the same middleware as the first visit.

## Limits of this demo

- There is no login, so the channels are public. Anyone can subscribe to `orders.2` and learn that the order changed. An app with users registers a private channel and an authorizer.
- Events are delivered in memory, inside one server process. Run more than one process and you need the Redis driver.
- Live props need a Bun server that keeps a socket open. On Cloudflare Workers, AWS Lambda or Vercel the pages still render, and they do not update.

## Checks

```bash
bunx guren gate
```

runs codegen, typecheck, lint, the framework's integrity checks, the security audit and the tests in `tests/`.

## The recording

`recording/record.mjs` drives both pages with Playwright and records them. With the dev server running:

```bash
cd recording
bun install
bunx playwright install chromium
node record.mjs http://localhost:3333
```

The videos and the click timings land in `recording/out/`.

## Learn more

- [Live Props guide](https://guren.dev/docs/guides/live-props?ref=live-props-demo)
- [Guren on GitHub](https://github.com/gurenjs/guren)

## License

MIT
