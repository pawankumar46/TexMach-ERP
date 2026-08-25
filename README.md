# InvenTree — HCA Inventory

Phase 1 frontend demo for **Hari Chand Anand & Co.** (HCA). Backend is not connected yet. All screens run on dummy data so stakeholders can walk through personas, inventory, stock, and multi-facility warehouses.

Catalog names and product photos are taken from the public HCA product list: [grouphca.com/collections/all](https://www.grouphca.com/collections/all).

## Features (Phase 1)

Blueprint modules delivered in this demo:

- **User / role management** — four personas with facility-scoped access
- **Inventory & stock management** — SKU master with photos, names, stock status, dummy costs, and catalog add/edit
- **Multi-facility warehouse management** — five Indian facilities, bin locations, utilization, transfers
- **Barcode / RFID app** — GRN, putaway, picking, and cycle-count task queue with simulated scanning

Homepage is a **sign-in screen** (email + password). After login, Home shows KPIs for the selected role and facility scope.

### Demo sign-in

| Role | Email | Password |
| --- | --- | --- |
| Super Admin | ananya.sharma@grouphca.com | Admin@123 |
| Store Manager | rohit.mehra@grouphca.com | Manager@123 |
| Store Executive | priya.nair@grouphca.com | Staff@123 |
| Vendor (Duke) | kenji.sato@duke-oem.example | Vendor@123 |

The login page includes a collapsible **Demo accounts for review** panel to fill the form quickly.

### Personas

| Persona | Demo user | What they see |
| --- | --- | --- |
| Super Admin | Ananya Sharma | All five facilities, users & roles, consolidated ledger |
| Store Manager | Rohit Mehra | Delhi, Gurugram, Mumbai — transfers and facility KPIs |
| Store Executive | Priya Nair | Delhi HQ only, plus the scan app |
| Vendor | Kenji Sato | Duke catalog only. Can **add and edit** Duke items. No warehouse quantities, transfers, or scanning (PO/ASN is Phase 2) |

### Facilities

Delhi HQ Store, Gurugram Central Warehouse, Mumbai Regional Store, Bengaluru Service Hub, Ahmedabad Plant Store.

## Screens

- `/` — Sign in (email + password)
- `/dashboard` — Home KPIs, low-stock watchlist, recent movements in plain language
- `/inventory` — Product grid and table (photo + name + SKU); **Add item** / **Edit** for vendors, store managers, and Super Admin
- `/inventory/:productId` — Product detail and stock by facility
- `/stock` — Stock ledger, adjustments, transfers, movement history
- `/warehouses` — Facility cards and consolidated vs facility toggle
- `/scan` — Scan a machine when it arrives, is put away, goes out, or is counted
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
├── data/                # Dummy catalog, facilities, personas, seed ledger
├── features/
│   ├── auth/            # Login page and auth schema
│   ├── dashboard/
│   ├── inventory/
│   ├── scan/
│   ├── stock/
│   ├── users/
│   └── warehouses/
├── lib/                 # Formatters and mappers
├── routes/
├── services/            # Dummy async services (swap for API later)
└── store/               # Zustand stores
```

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

React Router, Zustand, Tailwind CSS, Lucide, Framer Motion, React Hook Form, Zod, Sonner, `clsx`, `tailwind-merge`.

## Changelog

**2026-08-25** — Phase 1 frontend: persona homepage, inventory from the HCA catalog, multi-facility stock ledger, warehouse view, barcode scan queue, and Super Admin user/role console.

**2026-08-25** — Vendors (and other catalog managers) can add and edit inventory items. Duke OEM partner Kenji Sato is limited to the Duke brand.

**2026-08-25** — Replaced persona picker with email/password sign-in. Demo credentials map to the four Phase 1 roles.

**2026-08-25** — Rebranded from TexMach ERP to InvenTree across UI, page title, and config.
