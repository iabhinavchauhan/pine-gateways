# Deployment guide

The application deploys as two independent services:

- React/Vite frontend on Cloudflare Pages.
- Express API on Render Web Services.

The repository has no root `package.json`. It contains `client/package.json`
and `server/package.json`. The API also imports the property catalog and
pricing helper from `client/src`, so the Render service must keep the
repository root as its checkout context.

## Cloudflare Pages — frontend

Create a Pages project and connect the GitHub repository.

| Setting | Value |
| --- | --- |
| Production branch | `main` (or the branch selected for releases) |
| Root Directory | `client` |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Environment variable | `VITE_API_URL=https://<your-render-service>.onrender.com/api` |

Replace `<your-render-service>` with the actual Render service hostname after
creating the API. Do not include credentials in this value. `VITE_*` values are
compiled into public frontend assets.

The Vite development server proxies `/api` to `http://localhost:3001`. That
proxy is only used for local development. A production build without
`VITE_API_URL` intentionally fails API calls with a clear configuration error
instead of trying localhost or Cloudflare Pages' origin. The
`client/public/_redirects` file configures Pages to serve the SPA entry point
for direct navigation and refreshes on paths such as `/homestays/sakar-homestay`.

After changing a Pages environment variable, trigger a new deployment so Vite
rebuilds the frontend with the new value. Use **Retry deployment** or push a
new commit after saving the setting.

## Render — backend

Create a **Web Service** for the same GitHub repository. Do not set the Root
Directory to `server`: the API imports sibling `client/src` catalog and
pricing modules, and Render limits files available to a service whose root
directory is narrowed to a subfolder.

| Setting | Value |
| --- | --- |
| Runtime | Node |
| Root Directory | Leave blank (repository root) |
| Build command | `npm ci --prefix server --omit=dev` |
| Start command | `npm --prefix server start` |
| Health check path | `/api/health` |

These commands explicitly target `server/package.json` and
`server/package-lock.json`; a root `package.json` is neither required nor
present. `server/package.json` starts `src/index.js`, and the server binds to
`0.0.0.0` on Render's injected `PORT`.

Configure these environment variables in Render:

| Variable | Value |
| --- | --- |
| `NODE_ENV` | `production` |
| `CLIENT_ORIGIN` | The exact Cloudflare Pages production origin, for example `https://<your-pages-project>.pages.dev`. Do not include a path or trailing slash. |
| `DATA_FILE` | `/var/data/site-data.json` when using the persistent disk below |
| `PORT` | Do not set manually; Render supplies it. |

The API CORS policy accepts only the exact origins in `CLIENT_ORIGIN`. Separate
multiple exact origins with commas if needed, such as the Pages production
origin and an approved custom domain. Avoid `*`. The server exits during
startup in production when `CLIENT_ORIGIN` is missing.

### Persistent JSON data

The current `server/src/dataStore.js` reads and atomically rewrites a JSON file.
It stores reviews, enquiries, bookings, and feedback; it is not read-only
configuration. The catalog itself remains source data in
`client/src/data/resortData.js`. The default runtime data file is ignored by
Git and is initialized if it does not exist.

Render's ordinary filesystem is ephemeral. Configure a persistent disk for
the Web Service:

| Disk setting | Value |
| --- | --- |
| Name | `pine-getaways-data` |
| Mount path | `/var/data` |
| Size | `1 GB` or larger if actual retained data requires it |

The included `render.yaml` declares this disk and the start/build commands.
Persistent disks require a Render plan that supports disks. If a previous
deployment has user records that are not on a persistent disk, export and copy
the existing `site-data.json` to `/var/data/site-data.json` before switching
`DATA_FILE`; do not overwrite it with a fresh/empty file. The JSON store is
single-instance storage and is not suitable for concurrent multi-instance
writers. No database migration is included.

### Deploy and inspect

1. Save the environment variables and disk settings.
2. Create or update the Web Service and deploy the selected branch.
3. Open the Render service **Events** and **Logs** tabs to inspect build and
   startup output. Startup logs should show `Pine Getaways API listening on
   0.0.0.0:<port>`.
4. Visit `https://<your-render-service>.onrender.com/api/health`; expect
   `{"status":"ok"}`.
5. Set Cloudflare's `VITE_API_URL` to that service's `/api` base and redeploy
   Pages.

The Render service name in `render.yaml` is `pine-getaways-api`; select or
rename it deliberately if a service with that name already exists.

## Integration and troubleshooting

The browser sends API requests directly from the Cloudflare Pages origin to
`VITE_API_URL`. Render compares the request's `Origin` against
`CLIENT_ORIGIN`; the frontend does not contain server credentials.

Test API connectivity:

```powershell
Invoke-RestMethod -Uri 'https://<your-render-service>.onrender.com/api/health'
```

Then load the deployed Pages site, open browser developer tools, and submit a
booking or enquiry. Check the Network panel for the request URL and response.

| Symptom | Checks |
| --- | --- |
| Render says it cannot find `/opt/render/project/src/package.json` | Leave Root Directory blank (repository root), then use `npm ci --prefix server --omit=dev` and `npm --prefix server start`. The repository intentionally has no root package manifest. |
| Render build cannot find `client/src/...` | The service Root Directory is narrowed to `server`. Restore repository root as Root Directory. |
| API service fails during startup | Check Render logs, `NODE_ENV`, the Render-injected `PORT`, and that `CLIENT_ORIGIN` is set to the exact Pages origin. |
| Browser reports CORS failure | Confirm `CLIENT_ORIGIN` exactly matches the browser address bar's scheme, host, and optional port. Add each approved origin explicitly and redeploy the API. |
| Frontend reports API URL not configured | Set Cloudflare `VITE_API_URL` to `https://<actual-service>.onrender.com/api` and rebuild/redeploy Pages. |
| API returns 404 | Check that the request URL includes `/api` exactly once and that the route exists (for example `/api/health`). SPA fallback only applies to frontend routes, not API paths. |
| Property URL returns a Cloudflare 404 | Confirm Pages root is `client`, output is `dist`, and the `client/public/_redirects` file is included in the deployed output. |
| Booking data disappears after a deploy/restart | Confirm a persistent disk is attached at `/var/data`, `DATA_FILE=/var/data/site-data.json`, and the app logs show no file permission or write errors. Copy any existing records onto the disk before first use. |

## Local configuration

`client/.env.example` and `server/.env.example` contain safe local templates.
Copy the relevant one to `.env` for local use. Do not commit `.env` files.
`VITE_API_URL` should be omitted for local development so Vite's `/api` proxy
is used. The API's local CORS default is `http://localhost:5173`.
