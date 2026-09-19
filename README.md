# gastosFoto — Expense Tracker with Photos

A small self-hosted web app for logging personal expenses ("gastos") together with a photo of the receipt, the GPS coordinates of where the purchase happened, and the bank account the money came from. Records can be browsed, filtered, edited, deleted, and summarized in a monthly chart.

The whole server lives in a single file: **`app.js`**.

------------------------------------------------------------------------

## Technology stack

### Backend

| Piece | What it does |
|------------------------------------|------------------------------------|
| **Node.js + [Express](https://expressjs.com/) 4** | HTTP server and routing. Started with `app.listen(3000)` at the top of `app.js`. |
| [**MongoDB**](https://www.mongodb.com/) **+ [Mongoose](https://mongoosejs.com/) 8** | Data store. Connects to `mongodb://localhost:27017/DB_APP_GASTOS` and maps the `GASTOS_FOTO` collection through a single schema/model defined in `app.js:23-42`. |
| [**Multer**](https://github.com/expressjs/multer) | `multipart/form-data` handling for receipt uploads. Uses `diskStorage`, writes into `public/uploads/`, and renames each file to `Date.now() + <original extension>` so names never collide (`app.js:44-53`). |
| [**body-parser**](https://github.com/expressjs/body-parser) | Parses URL-encoded form posts into `req.body`. |
| **`fs` / `path`** | Physically deletes image files when a record or an individual photo is removed, and preserves file extensions on upload. |
| [**EJS**](https://ejs.co/) **3** | Server-side templating. Set as the view engine, so routes render `.ejs` files from `views/`. |
| **`express.static("public")`** | Serves CSS, client-side JS, and the uploaded images directly off disk. |

### Frontend

| Piece | What it does |
|------------------------------------|------------------------------------|
| **Bootstrap 3.4 + Semantic UI 2.4** (CDN) | Grid, forms, buttons, and the top navbar. Loaded in `views/partials/header.ejs`. |
| **`public/css/belleza.css`** | Custom styles: the upload spinner, image fitting (`.fit-image`), scrollable result panes (`.parrafo`), hidden fields (`.esconde`). |
| **Vanilla JS — `public/logica/logica1.js`** | Geolocation capture, loading spinner, cascading "categoría específica" lists, paste-to-upload. |
| **Vanilla JS — `public/logica/logica2.js`** | Cascading account lists driven by the selected origin/destination bank. |
| [**Plotly.js**](https://plotly.com/javascript/) (CDN) | The monthly-expense summary chart at the bottom of the filter screen. |
| **Google Maps JavaScript API** | Loaded on the index page; map links elsewhere point at `maps.google.com`. |

### Legacy / side artifacts

The repo carries traces of an earlier SQL Server version of this app — `mssql` is still in `package.json`, `SQL Trigger/01_trigger.sql` and `stored Proc/paraBusqueda.sql` hold the old T-SQL, and the CSV files (`CSV_BACKUP_TGASTOSFOTO.csv`, `Checking1.csv`) are exports from that era. Because of the migration, every route still wraps its Mongoose result in `{ recordset: [...] }` so the existing EJS templates keep working unchanged. `power BI/conexionPBI.pbix` is a Power BI report pointed at the same data. `socket.io` is declared and its client script is loaded, but no live events are wired up today.

------------------------------------------------------------------------

## Features

### 1. Expense entry form (`GET /` → `views/index.ejs`)

The home page is one large form posting to `POST /`. Fields are grouped in three fieldsets:

-   **Generalidades** — date, amount, expense category (`Supermercado`, `Restaurantes`, `Renta`, `Gastos Taxi`, …), and a free-text *categoría específica* backed by a `<datalist>`.
-   **Info de Bancos** — origin bank/account, destination bank/account, and a confirmation number. This whole block is hidden by default and toggled by the "Ver Info de Bancos" checkbox (`logica1.js:13-23`).
-   **Info Opcional** — description, latitude, longitude, and the file input.

There is also an "Es Factura" checkbox that stores `esFactura: 1` on the document.

**Cascading dropdowns.** Picking a category repopulates the *categoría específica* datalist (e.g. `Gastos Taxi` → Lyft / Uber / Otro). Picking a bank repopulates the account datalist (e.g. `Wells Fargo` → `WF-checking-…`, `WF-TD-8167`, `WF-TC-38163`). This is plain DOM manipulation in `logica1.js` and `logica2.js`.

**Paste to attach.** A window-level `paste` listener assigns `e.clipboardData.files` straight onto the file input, so a screenshot copied to the clipboard can be attached without opening a file dialog (`logica1.js:133-135`).

**Loading spinner.** Clicking submit reveals `.loadingFrame` — useful because photo uploads over a phone connection are slow.

### 2. Geolocation

Two separate mechanisms, working together:

-   **Capture** — on page load, `getLocation()` calls the browser's `navigator.geolocation.getCurrentPosition()` and writes the coordinates into the hidden-in-plain-sight `latitud` / `longitud` inputs (`logica1.js:102-127`). Submitting the form from a phone at the store therefore stamps the expense with where it happened, with no extra tapping. The fields stay editable if the reading is wrong.
-   **Display** — every row in the index table and in the filter results renders a *Map Link* pointing at `https://maps.google.com/?q=<latitud>,<longitud>`, which opens the location in Google Maps (or the native Maps app on mobile).

The **Google Maps JavaScript API** `<script>` tag is loaded at the bottom of `index.ejs` with the project's API key. Note that its callback parameter is currently malformed (`callback=init Map`, with a space, and no `initMap` function defined), so an embedded interactive map is not actually rendering — the working map experience today is the `maps.google.com` deep link. The key is hardcoded in the template; moving it to an environment variable and restricting it by HTTP referrer in the Google Cloud console would be the natural hardening step.

### 3. Recent expenses table

Below the form, the index renders the **10 most recent records** (`sort({ id: -1 }) .limit(10)`) in a scrollable Bootstrap table: id, date, amount, category, specific category, description, origin bank, the map link, and the attached filenames. The id and the filenames both link to the detail view.

### 4. Querying / filtering (`GET|POST /resultadosFiltro`, `views/resultadosFiltroBD.ejs`)

Reachable from the "Filtro Base de Datos" item in the navbar. The page has a filter form on top, the matching rows in the middle, and the summary chart at the bottom.

-   The form posts to `POST /filtroBase`, which builds a Mongoose query **dynamically** — only the fields the user actually filled in are added to the query object (`app.js:120-146`).
-   Each filter is a **case-insensitive partial match** (`{ $regex: value, $options: 'i' }`) on `cat_gasto`, `cat_especifica`, and `bancoDestino`.
-   Results come back sorted newest-first (`sort({ Fecha: -1 })`), are stashed in the module-level `elArraysito` variable, and the route redirects to `GET /resultadosFiltro` which renders them.
-   Each result row carries the map link, a link to the photo, and an **X delete button** guarded by a `confirm()` dialog.

> Implementation note: `elArraysito` is a single module-scoped variable, so the last search wins globally. That is fine for a single-user app behind personal auth, but it is the thing to change first if this is ever shared. `views/filtroBD.ejs` (`GET /filtroBase`) is an earlier, form-only version of the same screen.

### 5. Summary charts (bottom of the filter screen)

Rendered client-side with **Plotly.js**. The server serializes the filtered result set into the page (`JSON.stringify(elArraysito.recordset)`), and the inline script in `resultadosFiltroBD.ejs:140-208`:

1.  **Groups by month** — reduces every record into a `YYYY-MM` bucket and sums `MontoGasto`.
2.  **Plots a horizontal bar chart** — one bar per month, sorted chronologically, titled *Monthly Expenses*, with each bar labeled by its dollar total.
3.  **Re-filters by date range** — a *Start Date* / *End Date* pair plus a **Filter** button narrows the already-loaded data in the browser and redraws the chart. No server round-trip, so it is instant.

So the flow is: filter by category/bank on the server → see the matching rows → narrow by date and read the monthly totals in the chart.

### 6. Detail view (`GET /show/:id` → `views/showFoto.ejs`)

Shows one expense with all of its attachments rendered by file type: images inline, PDFs in an `<iframe>`, anything else as a labeled download. Each attachment has its own **Bajelo** (download) and **Borrar imagen** buttons, plus an **Edita** button for the record.

### 7. Multiple attachments per expense

`imagen` is stored as an **array of filenames**, and both the create and the edit routes use `upload.array('imagen', 10)` — up to 10 files per expense. The templates defensively handle both shapes (array, or a bare string from older records written before the migration).

### 8. Editing (`GET /editar/:id`, `POST /seEdita`)

A prefilled form on the left, live previews of the current attachments on the right (images, video, audio, and generic files each get their own renderer). Uploading new files **appends** to the existing array rather than replacing it. Clearing the filename field deletes the listed files from disk and empties the array.

### 9. Deleting (`POST /borrar/:id`)

One route, two behaviors, chosen by inspecting the parameter:

-   If `:id` is a **valid MongoDB ObjectId** → delete the whole document *and* `unlink` every attached file from `public/uploads/`.
-   Otherwise `:id` is treated as a **filename** → `$pull` just that filename out of the record's `imagen` array and delete that one file, leaving the expense itself intact. If the array ends up empty, the field is unset.

### 10. Bank balances (`GET /saldoBanco`)

Navbar entry and template exist, but the route is a stub — it renders an empty array with a comment noting it needs its own collection (`app.js:107-118`). This was backed by the `mirarUltimoSaldo` object in the old SQL Server database.

------------------------------------------------------------------------

## Data model

The `GASTOS_FOTO` collection (`app.js:23-40`):

| Field | Type | Notes |
|------------------------|------------------------|------------------------|
| `id` | Number | Human-friendly sequential id, computed as `max(id) + 1` on insert |
| `Fecha` | Date | Date of the expense — **required** |
| `MontoGasto` | Number | Amount — **required** |
| `cat_gasto` | String | Expense category — **required** |
| `cat_especifica` | String | Sub-category |
| `descripcion` | String | Free text |
| `imagen` | \[String\] | Filenames under `public/uploads/` |
| `latitud` / `longitud` | String | Captured from the browser at entry time |
| `bancoOrigen` / `cuentaOrigen` | String | Where the money came from |
| `bancoDestino` / `cuentaDestino` | String | Where it went (transfers, card payments) |
| `numConfirmacion` | String | Transaction confirmation number |
| `esFactura` | Number | `1` if the receipt is an invoice, else `0` |
| `FECHA_LOADED` | Date | When the record was entered |

MongoDB's own `_id` is what the `/show`, `/editar`, and `/borrar` URLs use; the numeric `id` is just what gets displayed.

------------------------------------------------------------------------

## Routes

| Method | Path | Purpose |
|------------------------|------------------------|------------------------|
| `GET` | `/` | Entry form + 10 most recent expenses |
| `POST` | `/` | Create an expense (up to 10 files) |
| `GET` | `/show/:id` | Detail view with all attachments |
| `GET` | `/editar/:id` | Edit form |
| `POST` | `/seEdita` | Apply the edit (up to 10 new files) |
| `POST` | `/borrar/:id` | Delete a record (ObjectId) or a single image (filename) |
| `GET` | `/filtroBase` | Standalone filter form (legacy) |
| `POST` | `/filtroBase` | Run the query, then redirect |
| `GET` | `/resultadosFiltro` | Filter form + results + monthly chart |
| `GET` | `/saldoBanco` | Bank balances (stub) |

------------------------------------------------------------------------

## Running it

Prerequisites: **Node.js** and a **MongoDB** instance listening on `localhost:27017` with a database named `DB_APP_GASTOS`.

``` bash
npm install
node app.js          # or: npx nodemon app.js
```

The server listens on **port 3000** — <http://localhost:3000>.

### Exposing it to your phone

The app is designed to be used from a phone at the point of purchase (that is what makes the geolocation capture worthwhile). It is exposed through an [ngrok](https://ngrok.com/) tunnel with Google OAuth in front of it, restricted to a single email address — see `conectarNgrok.txt`:

``` bash
ngrok http --domain=gastos.ngrok.io 3000 --oauth google --oauth-allow-email <your-email>
```

That tunnel *is* the authentication layer: the app itself has no login, no sessions, and no authorization checks. Do not expose port 3000 directly.

------------------------------------------------------------------------

## Project layout

```         
app.js                        # the entire server: schema, routes, upload config
package.json
views/
  index.ejs                   # entry form + recent expenses
  filtroBD.ejs                # legacy filter form
  resultadosFiltroBD.ejs      # filter + results + Plotly monthly chart
  showFoto.ejs                # detail view
  editando.ejs                # edit form + attachment previews
  saldoBanco.ejs              # bank balances (stub)
  partials/header.ejs         # <head>, CDN links, navbar
public/
  css/belleza.css             # custom styles
  logica/logica1.js           # geolocation, spinner, category cascades, paste-upload
  logica/logica2.js           # bank → account cascades
  uploads/                    # receipt images (served statically)
SQL Trigger/, stored Proc/    # legacy T-SQL from the SQL Server version
power BI/conexionPBI.pbix     # Power BI report over the same data
*.csv                         # data exports / backups
```