# Pine Getaways API

The Express API serves the property catalog and accepts reviews, reservation
requests, contact enquiries, and feedback.

## Run locally

```powershell
npm install
npm run dev
```

The API listens on port `3001` by default. The frontend's Vite development
server proxies `/api` to this port.

## Endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/health` | Health check |
| GET | `/api/homestays` | List the three homestays and room details |
| GET | `/api/homestays/:slug` | Get one homestay |
| GET | `/api/food` | List dishes; optional `?stay=:slug` filter |
| GET | `/api/blog` | List blog posts |
| GET | `/api/blog/:slug` | Get one blog post |
| GET | `/api/gallery` | List general gallery images |
| GET | `/api/reviews` | List reviews; optional `?staySlug=:slug` filter |
| POST | `/api/reviews` | Submit a review |
| POST | `/api/bookings` | Submit a pending reservation request |
| POST | `/api/inquiries` | Submit a contact or trip enquiry |
| POST | `/api/feedback` | Submit feedback |

Write endpoints return `201` for accepted records and `400` for invalid input.
Bookings validate the property, room, dates, guests and contact information.
The server calculates nights and estimated price from the catalog room rate;
client-submitted prices are ignored. Requests remain pending until the host
confirms availability.

## Pricing

The catalog's `room.price` is treated as the customer-facing nightly rate.
Properties may have a `pricing.customerDiscounts` array containing explicitly
approved rules with `label`, `percent`, and `minimumNights`. The server applies
the highest eligible configured percentage. No offers are configured by
default. Taxes, other fees, owner-agreed payouts, and commission calculations
are not configured because the required business rules were not supplied.

The public API contains no owner payout data.

## Persistence and environment

Submitted records are stored in `server/data/site-data.json` by default. Set
`DATA_FILE` to a durable file path when hosting. The JSON file store is suitable
for local development and low-volume single-instance use, not high-volume or
multi-instance production.

| Variable | Purpose |
| --- | --- |
| `PORT` | Listening port; defaults to `3001`. |
| `CLIENT_ORIGIN` | Comma-separated allowed browser origins; defaults to `http://localhost:5173`. |
| `DATA_FILE` | JSON persistence path; defaults to `server/data/site-data.json`. |

There is no admin authentication or admin API. Do not expose booking
management until a persistent database and server-side authentication and
authorization have been implemented.

## Tests

```powershell
npm test
```
