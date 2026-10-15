# The Pine Getaways

The Pine Getaways is a React/Vite homestay website with an Express API for
reservation requests, enquiries, reviews, and feedback.

## Requirements

- Node.js 22 or newer
- npm

## Run locally

Install dependencies and start the API:

```powershell
cd server
npm install
npm run dev
```

In a second terminal, start the frontend:

```powershell
cd client
npm install
npm run dev
```

Open the Vite URL shown in the terminal (normally `http://localhost:5173`).
Vite proxies `/api` to the API at `http://localhost:3001`.

## Build and test

```powershell
cd client
npm run build
npm run lint
```

```powershell
cd server
npm test
```

The production frontend is written to `client/dist`.
See [DEPLOYMENT.md](./DEPLOYMENT.md) for the exact Cloudflare Pages and Render
settings, CORS configuration, and persistent JSON disk setup.

## Locations and property data

The three homestay locations are defined with the property records in
`client/src/data/resortData.js` and are used by the homepage location filter:

- Mairung, Kalimpong — Sakar Homestay
- Damsang Valley, Kalimpong — Vivanta Homestay
- Pradhan Gaon, Kalimpong — Green Leaf Homestay

Do not add, rename, merge, or reassign these locations without the business
owner's direction. Room rates, property images, amenities, descriptions, and
contacts are in the same catalog. The property pages only use the main image
currently supplied for that property; add approved, property-specific photos
to the property's `gallery` before publishing a larger gallery.

## Pricing and bookings

Each room's `price` in `client/src/data/resortData.js` is the current
customer-facing nightly rate used by the API to calculate a reservation
estimate. The server ignores any price submitted by the browser and calculates
the estimate from the selected room and validated dates. A booking record
includes a unique reference, room rate, number of nights, subtotal, applicable
configured discount, estimated total, status, and creation timestamp.

The booking is a **request pending host confirmation**, not a confirmed
reservation. There is no live availability, payment, configured tax, or
additional-fee calculation.

No discount or commission agreement has been supplied, so no discounts or
commission are currently applied. To configure a customer discount, add
explicit property data in this shape:

```js
pricing: {
  customerDiscounts: [
    {
      label: '<owner-approved offer name>',
      percent: <owner-approved percentage>,
      minimumNights: <owner-approved minimum nights>,
    },
  ],
}
```

Supply an approved label, percentage (greater than 0 and less than 100), and
minimum-night threshold. If more than one configured offer qualifies, the
highest percentage is applied. Confirm applicable customer rates, owner-agreed
rates, taxes, fees, and any commercial terms with the business owner before
production. Owner payout and commission data are not collected or exposed.

## Admin and data storage

There is no admin panel or authentication system in this project. The current
JSON-file API does not provide the persistent database and authorization
foundation needed for a secure management console, so no public or
hardcoded-data admin interface has been added. Before launching an admin
workflow, select an authentication provider, persistent database, and
server-side authorization policy.

The API stores submitted bookings, reviews, enquiries, and feedback in
`server/data/site-data.json` by default. Set `DATA_FILE` to a durable mounted
path in hosted environments and back it up. This local JSON store is not
recommended for high-volume or multi-instance production deployments.

## Environment variables

| Variable | Used by | Purpose |
| --- | --- | --- |
| `PORT` | API | Listening port; defaults to `3001`. |
| `CLIENT_ORIGIN` | API | Comma-separated allowed browser origins; defaults to `http://localhost:5173` locally and is required in production. |
| `DATA_FILE` | API | JSON data-file path; defaults to `server/data/site-data.json`. |
| `VITE_API_URL` | Frontend build | Required in production; set to the Render service's `/api` URL. Local development defaults to the Vite `/api` proxy. |

No API secrets are required by the current application. Do not put private
credentials in `VITE_*` variables; frontend build variables are public.

## Deployment notes

1. Build the frontend with `npm run build` from `client`.
2. Host `client/dist` on a static host and configure SPA fallback to
   `index.html` so direct property URLs continue to work.
3. Deploy the API separately or behind the same origin; set `PORT`,
   `CLIENT_ORIGIN`, and a durable `DATA_FILE` as appropriate.
4. If the API is on a separate origin, build the frontend with `VITE_API_URL`
   set to that API's `/api` base URL.
5. Verify the approved images, customer rates, contact details, and any
   configured discounts with the business owner.

The canonical URL and Open Graph metadata use `https://thepinegetaways.com`.
Change those values in `client/index.html` and the homestay detail page if the
production domain is different.
