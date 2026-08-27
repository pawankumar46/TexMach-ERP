import { VENUE_TYPES } from "@/constants/venue-types"

export const FACILITIES = [
  {
    id: "del-hq",
    code: "DEL-HQ",
    name: "Delhi HQ Store",
    city: "New Delhi",
    region: "North",
    address: "Okhla Industrial Area, Phase II",
    type: VENUE_TYPES.DISTRIBUTOR_OFFICE,
    bins: ["A-01", "A-02", "B-12", "FG-01"],
    capacityUnits: 420,
  },
  {
    id: "ggm-wh",
    code: "GGM-WH",
    name: "Gurugram Central Warehouse",
    city: "Gurugram",
    region: "North",
    address: "IMT Manesar, Sector 8",
    type: VENUE_TYPES.GODOWN_WAREHOUSE,
    bins: ["WH-01", "WH-02", "WH-14", "QC-01"],
    capacityUnits: 980,
  },
  {
    id: "mum-rs",
    code: "MUM-RS",
    name: "Mumbai Regional Store",
    city: "Mumbai",
    region: "West",
    address: "Andheri East, MIDC",
    type: VENUE_TYPES.DISTRIBUTOR_OFFICE,
    bins: ["M-01", "M-02", "M-07"],
    capacityUnits: 260,
  },
  {
    id: "blr-sh",
    code: "BLR-SH",
    name: "Bengaluru Service Hub",
    city: "Bengaluru",
    region: "South",
    address: "Peenya Industrial Area",
    type: VENUE_TYPES.DISTRIBUTOR_OFFICE,
    bins: ["S-01", "S-02", "SPARES-1"],
    capacityUnits: 180,
  },
  {
    id: "amd-pl",
    code: "AMD-PL",
    name: "Ahmedabad Plant Store",
    city: "Ahmedabad",
    region: "West",
    address: "Changodar Industrial Estate",
    type: VENUE_TYPES.GODOWN_WAREHOUSE,
    bins: ["P-01", "P-02", "P-08", "WIP-02"],
    capacityUnits: 540,
  },
]

export const getFacilityById = (facilityId) => {
  return FACILITIES.find((facility) => facility.id === facilityId) ?? null
}
