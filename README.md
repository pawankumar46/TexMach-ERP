# InvenTree — HCA Inventory

Phase 1 frontend demo for **Hari Chand Anand & Co.** (HCA). Backend is not connected yet. All screens run on dummy data so stakeholders can walk through personas, inventory, stock, and multi-facility warehouses.

Catalog names and product photos are taken from the public HCA product list: [grouphca.com/collections/all](https://www.grouphca.com/collections/all).

## Features (Phase 1)

Blueprint modules delivered in this demo:

- **User / role management** — four personas with facility-scoped access
- **Inventory & stock management** — SKU master with photos, names, stock status, dummy costs, and catalog add/edit/delete
- **Venues** — distributor offices and godowns / warehouses, with type filter, bin locations, utilization, transfers
- **Barcode / RFID app** — Component scan queue: assign to warehouse, retain in store, scrape (recoverable or final), exchange

Homepage is a **sign-in screen** (email + password). After login, Home shows KPIs for the selected role and venue scope.

### Demo sign-in

| Role | Email | Password |
| --- | --- | --- |
| Super Admin | ananya.sharma@grouphca.com | Admin@123 |
| Store Manager | rohit.mehra@grouphca.com | Manager@123 |
| Store Executive | priya.nair@grouphca.com | Staff@123 |
| Category Manager | neha.verma@grouphca.com | Category@123 |

The login page includes a collapsible **Demo accounts for review** panel to fill the form quickly.

### Personas

| Persona | Demo user | What they see |
| --- | --- | --- |
| Super Admin | Ananya Sharma | All five venues, users & roles, consolidated ledger |
| Store Manager | Rohit Mehra | Delhi, Gurugram, Mumbai — transfers and venue KPIs |
| Store Executive | Priya Nair | Delhi HQ only, plus the scan app |
| Vendor | Kenji Sato | Duke catalog only. Can **add, edit, and delete** Duke items. No warehouse quantities, transfers, or scanning (PO/ASN is Phase 2) |
| Category Manager | Neha Verma | Only **Spot Tacking (DY 160-20)** and **Pattern Sewing (DY 3020)** plus their BOM components and stock |

### Venues

| Venue | Type |
| --- | --- |
| Delhi HQ Store | Distributor Office |
| Gurugram Central Warehouse | Godown / Warehouse |
| Mumbai Regional Store | Distributor Office |
| Bengaluru Service Hub | Distributor Office |
| Ahmedabad Plant Store | Godown / Warehouse |

## Screens

- `/` — Sign in (email + password)
- `/dashboard` — Home KPIs, low-stock watchlist, recent movements in plain language
- `/inventory` — Product grid and table; search machines **or BOM components** (shows parent machine + matched parts); **Add** / **Edit** / **Delete** for allowed roles
- `/inventory/:productId` — Product detail, stock by facility, and **bill of materials** (52 components for each of the first five catalog machines). Click a BOM row to see facility stock quantities.
- `/stock` — Stock ledger with search, **facility/location filter**, status filter, adjustments, transfers, and **Export Excel**
- `/warehouses` — **Venues** (Distributor Office / Godown·Warehouse filter), cards, consolidated vs venue toggle
- `/scan` — Scan **components**: assign to warehouse, retain in store, scrape (recoverable / final), or exchange. New arrivals removed.
- `/users` — Persona matrix and demo user directory (Super Admin)

## Getting started

```bash
npm install
npm run dev
```

Then open the local URL Vite prints (usually `http://localhost:5173`).

```bash
npm run lint
npm run build
```

No backend URL is required. Stock changes live in memory for the browser session and reset on full reload.

## Project structure

```text
src/
├── components/          # Shared UI and app shell
├── constants/           # Roles, stock status, movement types
├── data/                # Dummy catalog, facilities, personas, seed ledger, BOM
├── features/
│   ├── auth/            # Login page and auth schema
│   ├── dashboard/
│   ├── inventory/
│   │   └── components/  # Filters, grid/table, product form, BOM table
│   ├── scan/
│   ├── stock/
│   ├── users/
│   └── warehouses/
├── lib/                 # Formatters, mappers, motion presets
├── routes/
├── services/            # Dummy async services (swap for API later)
└── store/               # Zustand stores
```

Shared motion helpers live in `src/lib/motion.js` and `src/components/ui/motion.jsx` (fade, stagger, page enter).

Data flow: **Page → Store → Service → dummy seed**. UI components do not call HTTP clients.

Refresh HCA catalog snapshot (optional):

```bash
python scripts/extract-hca-products.py
```

## Configuration

Frontend-only demo. Optional app title:

```text
VITE_APP_NAME=InvenTree
```

## Dependencies added

React Router, Zustand, Tailwind CSS, Lucide, Framer Motion, React Hook Form, Zod, Sonner, `xlsx`, `clsx`, `tailwind-merge`.

## Changelog

**2026-08-27** — Inventory search field includes a clear (X) control to reset the query.

**2026-08-27** — Inventory search for terms like “needle” shows a **Matching components** table (component + parent machine) above machine cards. Machines that matched via BOM are sorted first.

**2026-08-27** — Inventory search also matches BOM components. Results show the parent machine plus matched component name/ID/variant.

**2026-08-26** — Scan flow redesigned for **components**: removed New arrivals. Actions are Assign to warehouse, Retain in store, Scrape (recoverable / final), and Exchange.

**2026-08-26** — Added **Category Manager** persona (Neha Verma): scoped to specific machines and their BOM/stock. Cannot add new SKUs or use scan/users.

**2026-08-26** — Renamed Facilities to **Venues**. Venue type filter: Distributor Office and Godown / Warehouse.

**2026-08-26** — Stock ledger: filter by location/facility and Export Excel (`.xlsx`) for the currently filtered rows.

**2026-08-26** — BOM components are now machine-specific for the first five catalog SKUs (spot tacking, pattern sewing, glue spray stand, edge binding/cementing, button machine), not a shared parts list.

**2026-08-26** — BOM rows are clickable: a modal shows facility locations, bin, on-hand quantity, and available stock for that component.

**2026-08-26** — Product detail now includes a Bill of Materials table (component ID/name, variant ID/name, estimated procure time, vendor count). First five catalog machines each have 52 seeded components.

**2026-08-26** — Inventory delete: catalog managers can remove items from grid, table, and detail views with confirmation. Related stock, movements, and scan tasks for that SKU are cleared.

**2026-08-26** — Premium visual polish: soft canvas mesh, glass header/cards, Framer Motion page and stagger animations, richer login hero, dialog transitions, and hover depth on inventory cards. Respects `prefers-reduced-motion`.

**2026-08-25** — Phase 1 frontend: persona homepage, inventory from the HCA catalog, multi-facility stock ledger, warehouse view, barcode scan queue, and Super Admin user/role console.

**2026-08-25** — Vendors (and other catalog managers) can add and edit inventory items. Duke OEM partner Kenji Sato is limited to the Duke brand.

**2026-08-25** — Added `.cursor/rules/` and environment files to `.gitignore` (`.env.example` remains tracked).

**2026-08-25** — Replaced persona picker with email/password sign-in. Demo credentials map to the four Phase 1 roles.

**2026-08-25** — Rebranded from TexMach ERP to InvenTree across UI, page title, and config.
