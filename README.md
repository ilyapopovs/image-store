# payments-stripe

## Running locally

Create `.env.local` and fill the values

```sh
cp .env.example .env.local
```

Create a Database instance & run the migrations

```sh
turso dev --db-file local.db
drizzle-kit migrate
```

Set up Stripe Webhook listener/proxy

```sh
stripe listen -e customer.subscription.updated,customer.subscription.deleted,checkout.session.completed --forward-to http://localhost:3000/api/webhook

```

Run the Frontend

```sh
npm run dev # development mode
# or
npm run build && npm run start # for production mode
```

Open [`localhost:3000`](http://localhost:3000) in the browser ✅
