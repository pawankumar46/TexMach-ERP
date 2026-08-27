import { PRODUCTS } from "@/data/inventory-seed"
import { FACILITIES } from "@/data/facilities"

const hashString = (value) => {
  let hash = 2166136261
  for (const char of String(value)) {
    hash ^= char.charCodeAt(0)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

const TIME_OPTIONS = [
  "12 min",
  "18 min",
  "25 min",
  "35 min",
  "45 min",
  "1 hr",
  "1.5 hr",
  "2 hr",
  "2.5 hr",
  "3 hr",
]

const BOM_MACHINE_COUNT = 5
const COMPONENTS_PER_MACHINE = 52

/**
 * Machine-specific BOM catalogs for the first five HCA products.
 * Keys match product.sku so each machine gets its own parts list.
 */
const MACHINE_BOM_CATALOGS = {
  "DY 160-20": [
    { name: "Spot tacking needle bar", variants: ["DY160 short", "DY160 long", "Heavy fabric"] },
    { name: "Bar-tack cam set", variants: ["12mm tack", "18mm tack", "25mm tack"] },
    { name: "Tacking presser foot", variants: ["Standard", "Clear view", "Compensating"] },
    { name: "Spot stitch plate", variants: ["Narrow", "Wide", "Reinforced"] },
    { name: "DY160 servo motor", variants: ["400W", "550W", "750W"] },
    { name: "Tacking clutch brake", variants: ["Electromagnetic", "Mechanical", "Soft stop"] },
    { name: "Thread take-up for tacking", variants: ["Cast", "Forged", "Lightweight"] },
    { name: "Bobbin case DY160", variants: ["Steel", "Ceramic", "Anti-static"] },
    { name: "Hook race assembly", variants: ["Horizontal", "Oscillating", "Hardened"] },
    { name: "Feed dog tacking set", variants: ["Fine", "Medium", "Coarse"] },
    { name: "Knee lifter DY160", variants: ["Left", "Right", "Adjustable"] },
    { name: "Oil pump circulation kit", variants: ["Manual", "Auto drip", "Full loop"] },
    { name: "Machine head casting DY160", variants: ["Grey iron", "Aluminium", "Reinforced"] },
    { name: "Arm shaft DY160", variants: ["Standard", "Hardened", "Extended"] },
    { name: "Handwheel DY160", variants: ["Plastic", "Metal", "Ergonomic"] },
    { name: "Timing belt HTD", variants: ["5M", "8M", "Polyurethane"] },
    { name: "Control board DY160", variants: ["Rev A", "Rev B", "IoT"] },
    { name: "Foot pedal unit", variants: ["Single", "Dual", "Soft-start"] },
    { name: "Thread stand 2-spool", variants: ["Standard", "Heavy cone", "Anti-tangle"] },
    { name: "LED work lamp", variants: ["Warm", "Cool", "Adjustable"] },
    { name: "Power supply DY160", variants: ["110V", "220V", "Universal"] },
    { name: "Encoder sensor kit", variants: ["Optical", "Magnetic", "Hall"] },
    { name: "Safety cover guard", variants: ["Clear", "Mesh", "ABS"] },
    { name: "Oil pan gasket DY160", variants: ["Nitrile", "Silicone", "Cork"] },
    { name: "Table top panel", variants: ["Laminate", "Hardwood", "Anti-static"] },
    { name: "K-stand frame", variants: ["Fixed", "Caster", "Height adjust"] },
    { name: "V-belt pulley set", variants: ["A-section", "B-section", "Variable"] },
    { name: "Needle clamp DY160", variants: ["Single", "Quick-change", "Heavy"] },
    { name: "Reverse lever assembly", variants: ["Manual", "Spring", "Soft touch"] },
    { name: "Stitch density dial", variants: ["Mechanical", "Click", "Digital"] },
    { name: "Wire harness DY160", variants: ["Basic", "Shielded", "Modular"] },
    { name: "Status LED panel", variants: ["7-segment", "LCD", "Touch"] },
    { name: "Cover thread cutter", variants: ["Fixed", "Movable", "Auto"] },
    { name: "Spare needle pack DB", variants: ["#11", "#14", "#16"] },
    { name: "Bearing kit DY160", variants: ["Deep groove", "Needle", "Sealed"] },
    { name: "Cam follower set", variants: ["Steel", "Nylon", "Ceramic"] },
    { name: "Connecting rod DY160", variants: ["Forged", "Cast", "CNC"] },
    { name: "Oil sight window", variants: ["Round", "Rectangular", "LED"] },
    { name: "Dust cover DY160", variants: ["Vinyl", "Canvas", "Hard shell"] },
    { name: "Grease nipple pack", variants: ["M6", "M8", "Push-fit"] },
    { name: "Microswitch safety set", variants: ["NO", "NC", "Dual"] },
    { name: "Cooling fan 40mm", variants: ["Standard", "Silent", "High flow"] },
    { name: "Mounting screw kit", variants: ["M4", "M5", "Mixed"] },
    { name: "Model label plate", variants: ["Engraved DY160", "Printed", "QR"] },
    { name: "Pneumatic assist cylinder", variants: ["16mm", "20mm", "Double acting"] },
    { name: "Solenoid valve 3-way", variants: ["12V", "24V", "Quiet"] },
    { name: "Air FRL unit", variants: ["1/4\"", "3/8\"", "With gauge"] },
    { name: "Clamp pad set", variants: ["Rubber", "Silicone", "Felt"] },
    { name: "Guide rail short", variants: ["Aluminium", "Steel", "Hard-coat"] },
    { name: "Firmware chip DY160", variants: ["v1.2", "v1.4", "v2.0"] },
    { name: "Bobbin winder side", variants: ["Manual", "Auto cut", "Top mount"] },
    { name: "Tension discs DY160", variants: ["Single", "Dual", "Digital"] },
  ],
  "DY 3020": [
    { name: "XY pattern frame assembly", variants: ["200x100mm", "300x200mm", "Large field"] },
    { name: "Programmable servo X-axis", variants: ["400W", "750W", "1.0kW"] },
    { name: "Programmable servo Y-axis", variants: ["400W", "750W", "1.0kW"] },
    { name: "Pattern sewing needle bar", variants: ["Standard", "Heavy", "Long stroke"] },
    { name: "Electronic presser foot", variants: ["Pneumatic", "Stepper", "Soft clamp"] },
    { name: "Touch HMI panel DY3020", variants: ["7 inch", "10 inch", "Glove mode"] },
    { name: "Pattern memory board", variants: ["8MB", "16MB", "32MB"] },
    { name: "USB / LAN interface board", variants: ["USB only", "USB+LAN", "Wi-Fi module"] },
    { name: "Main drive motor DY3020", variants: ["750W", "1.0kW", "1.5kW"] },
    { name: "Timing belt XY kit", variants: ["HTD 5M", "HTD 8M", "Steel cord"] },
    { name: "Linear guide rail X", variants: ["15mm", "20mm", "Precision"] },
    { name: "Linear guide rail Y", variants: ["15mm", "20mm", "Precision"] },
    { name: "Ball screw X-axis", variants: ["1605", "2005", "C7 grade"] },
    { name: "Ball screw Y-axis", variants: ["1605", "2005", "C7 grade"] },
    { name: "Encoder absolute kit", variants: ["17-bit", "23-bit", "Multi-turn"] },
    { name: "Clamp frame set", variants: ["Magnetic", "Pneumatic", "Vacuum"] },
    { name: "Bobbin case electronic", variants: ["Steel", "Ceramic", "Large capacity"] },
    { name: "Hook assembly DY3020", variants: ["Horizontal", "Large bobbin", "Hardened"] },
    { name: "Thread trimmer unit", variants: ["Upper", "Lower", "Dual"] },
    { name: "Wiper blade assembly", variants: ["Standard", "Long", "Soft tip"] },
    { name: "Control PCB main", variants: ["Rev C", "Rev D", "Safety rated"] },
    { name: "Driver board dual axis", variants: ["Pulse", "EtherCAT", "CANopen"] },
    { name: "Power supply 48V rack", variants: ["500W", "750W", "Redundant"] },
    { name: "Emergency stop module", variants: ["Single channel", "Dual channel", "Category 3"] },
    { name: "Oil lubrication pump", variants: ["Auto timed", "Sensor based", "Manual backup"] },
    { name: "Machine head casting DY3020", variants: ["Cast iron", "Reinforced", "Low vibration"] },
    { name: "Stand & table DY3020", variants: ["Fixed", "Caster", "Anti-vibration"] },
    { name: "LED array work light", variants: ["Cool white", "Daylight", "Dimmable"] },
    { name: "Wire harness pattern head", variants: ["Shielded", "Modular", "High flex"] },
    { name: "Cooling fan dual", variants: ["60mm", "80mm", "Silent"] },
    { name: "Safety light curtain option", variants: ["300mm", "450mm", "Type 4"] },
    { name: "Foot pedal start unit", variants: ["Single", "Dual", "Heeled"] },
    { name: "Pattern software dongle", variants: ["Basic", "Pro", "Multi-user"] },
    { name: "SD / CF card slot board", variants: ["SD", "microSD", "CF"] },
    { name: "Home sensor X/Y pair", variants: ["Optical", "Inductive", "Magnetic"] },
    { name: "Limit switch kit", variants: ["Mechanical", "Proximity", "Redundant"] },
    { name: "Needle plate pattern", variants: ["Flat", "Slotted", "Wide field"] },
    { name: "Spare needle pack DY3020", variants: ["DB x 1", "DA x 1", "Titanium"] },
    { name: "Bearing kit high-speed", variants: ["Ceramic hybrid", "Sealed", "Angular"] },
    { name: "Grease pack high-temp", variants: ["NLGI 2", "Food grade", "Synthetic"] },
    { name: "Dust cover DY3020", variants: ["Fitted", "Roll-up", "Hard case"] },
    { name: "Label plate DY3020", variants: ["Engraved", "QR asset", "CE plate"] },
    { name: "Pneumatic FRL unit", variants: ["1/4\"", "3/8\"", "With dryer"] },
    { name: "Solenoid valve bank", variants: ["4-station", "6-station", "Silent"] },
    { name: "Clamp pad kit", variants: ["Rubber", "Silicone", "Fabric safe"] },
    { name: "Firmware ROM DY3020", variants: ["v3.1", "v3.4", "v4.0"] },
    { name: "UPS interface board", variants: ["Optional", "Standard", "Industrial"] },
    { name: "Cable drag chain", variants: ["15x20", "25x38", "Quiet"] },
    { name: "Operator key switch", variants: ["2-position", "3-position", "Keyed"] },
    { name: "Mounting hardware kit", variants: ["M5", "M6", "Mixed"] },
    { name: "Bobbin winder auto", variants: ["Side", "Integrated", "Dual"] },
    { name: "Tension unit digital", variants: ["Single", "Dual", "Closed loop"] },
  ],
  "DL-603": [
    { name: "Glue spray gun head", variants: ["Fine mist", "Medium", "Heavy bead"] },
    { name: "Spray nozzle set DL603", variants: ["0.5mm", "0.8mm", "1.2mm"] },
    { name: "Glue tank reservoir", variants: ["5L", "10L", "15L heated"] },
    { name: "Tank heater element", variants: ["200W", "400W", "Thermostatic"] },
    { name: "Temperature controller", variants: ["Analog", "PID digital", "Dual zone"] },
    { name: "Glue pump unit", variants: ["Gear", "Diaphragm", "Pneumatic"] },
    { name: "Stand column DL603", variants: ["Fixed height", "Telescopic", "Heavy base"] },
    { name: "Boom arm assembly", variants: ["Single", "Articulated", "Counterbalance"] },
    { name: "Hose heated line", variants: ["2m", "3m", "4m insulated"] },
    { name: "Air compressor interface", variants: ["1/4\"", "3/8\"", "Quick couple"] },
    { name: "Air filter regulator", variants: ["With gauge", "With dryer", "Coalescing"] },
    { name: "Solenoid spray valve", variants: ["2-way", "3-way", "Pulse"] },
    { name: "Foot pedal spray trigger", variants: ["Momentary", "Latching", "Soft"] },
    { name: "Control panel DL603", variants: ["Basic", "Digital", "Recipe memory"] },
    { name: "Pressure gauge kit", variants: ["Air", "Glue line", "Dual"] },
    { name: "Safety splash shield", variants: ["Clear", "Mesh", "Full surround"] },
    { name: "Drip tray pan", variants: ["Steel", "Aluminium", "Non-stick"] },
    { name: "Glue filter cartridge", variants: ["Coarse", "Fine", "Disposable"] },
    { name: "Stirring agitator", variants: ["Manual", "Motorized", "Slow mix"] },
    { name: "Level sensor tank", variants: ["Float", "Capacitive", "Optical"] },
    { name: "Overheat cutout", variants: ["Thermal fuse", "Resettable", "Dual"] },
    { name: "Power supply DL603", variants: ["110V", "220V", "Universal"] },
    { name: "Wire harness spray stand", variants: ["Basic", "Shielded", "IP54"] },
    { name: "Caster base kit", variants: ["Locking", "Heavy duty", "Anti-static"] },
    { name: "Nozzle cleaning kit", variants: ["Brush", "Needle", "Solvent cup"] },
    { name: "Spare gasket pack", variants: ["Nitrile", "Viton", "PTFE"] },
    { name: "Hose clamp set", variants: ["Worm", "Spring", "T-bolt"] },
    { name: "Quick-disconnect fittings", variants: ["Brass", "Stainless", "Plastic"] },
    { name: "Glue return line", variants: ["Standard", "Heated", "Insulated"] },
    { name: "LED work light arm", variants: ["Fixed", "Flexible", "Magnetic"] },
    { name: "Emergency stop button", variants: ["Mushroom", "Keyed", "Illuminated"] },
    { name: "Pneumatic cylinder clamp", variants: ["16mm", "25mm", "Double acting"] },
    { name: "Workpiece fixture plate", variants: ["Flat", "V-groove", "Custom"] },
    { name: "Anti-drip tip valve", variants: ["Spring", "Pneumatic", "Needle"] },
    { name: "Thermocouple sensor", variants: ["Type J", "Type K", "Pt100"] },
    { name: "Relay board DL603", variants: ["4-ch", "8-ch", "SSR"] },
    { name: "Cooling fan enclosure", variants: ["40mm", "60mm", "Filtered"] },
    { name: "Dust / fume hood option", variants: ["Local", "Ducted", "Carbon filter"] },
    { name: "Label plate DL603", variants: ["Engraved", "CE", "QR"] },
    { name: "Mounting bolt kit", variants: ["M8", "M10", "Mixed"] },
    { name: "Spare spray tip pack", variants: ["Fine", "Medium", "Wide"] },
    { name: "Glue viscosity cup", variants: ["Ford #4", "Zahn #2", "Digital"] },
    { name: "Operator gloves holder", variants: ["Side mount", "Magnetic", "Hook"] },
    { name: "Cable reel option", variants: ["Manual", "Spring", "5m"] },
    { name: "Firmware chip DL603", variants: ["v1.0", "v1.3", "v2.0"] },
    { name: "Safety interlock switch", variants: ["NO", "NC", "Dual"] },
    { name: "Base weight plate", variants: ["Cast", "Filled", "Bolt-on"] },
    { name: "Flexible whip hose", variants: ["1m", "1.5m", "Chemical resistant"] },
    { name: "Ball valve shutoff", variants: ["1/4\"", "3/8\"", "Full port"] },
    { name: "Spare heater cartridge", variants: ["200W", "400W", "Matched pair"] },
    { name: "Maintenance tool kit", variants: ["Basic", "Pro", "Plant"] },
    { name: "Cover / dust shroud", variants: ["Vinyl", "Canvas", "Hard"] },
  ],
  "DL-298": [
    { name: "Edge binding head DL298", variants: ["Narrow tape", "Wide tape", "Dual feed"] },
    { name: "Cementing roller set", variants: ["Rubber", "Steel", "Silicone"] },
    { name: "Glue applicator wheel", variants: ["Fine", "Medium", "Heavy"] },
    { name: "Automatic tape feeder", variants: ["Single", "Dual reel", "Sensor guided"] },
    { name: "Edge guide assembly", variants: ["Fixed", "Adjustable", "Auto center"] },
    { name: "Upper press roller", variants: ["Soft", "Hard", "Segmented"] },
    { name: "Lower drive roller", variants: ["Knurled", "Smooth", "Rubberized"] },
    { name: "Cement tank DL298", variants: ["2L", "5L", "Heated"] },
    { name: "Tank heater DL298", variants: ["150W", "300W", "PID"] },
    { name: "Temperature controller", variants: ["Analog", "Digital", "Recipe"] },
    { name: "Main drive motor DL298", variants: ["550W", "750W", "1.0kW"] },
    { name: "Timing belt drive kit", variants: ["HTD 5M", "HTD 8M", "Double sided"] },
    { name: "Pneumatic clamp cylinder", variants: ["20mm", "32mm", "Double acting"] },
    { name: "Solenoid valve bank", variants: ["3-station", "5-station", "Silent"] },
    { name: "Air FRL unit", variants: ["1/4\"", "3/8\"", "With gauge"] },
    { name: "Photo sensor edge detect", variants: ["Diffuse", "Through-beam", "Fiber"] },
    { name: "Encoder wheel kit", variants: ["Optical", "Magnetic", "High-res"] },
    { name: "Control PCB DL298", variants: ["Rev A", "Rev B", "Safety"] },
    { name: "HMI display panel", variants: ["LCD", "Touch 7\"", "Button pad"] },
    { name: "Foot pedal start", variants: ["Single", "Dual", "Soft"] },
    { name: "Emergency stop module", variants: ["Mushroom", "Dual channel", "Illuminated"] },
    { name: "Tape cutter blade", variants: ["Fixed", "Rotary", "Auto trim"] },
    { name: "Spare blade pack", variants: ["Standard", "Long life", "Ceramic"] },
    { name: "Glue pump gear unit", variants: ["Low viscosity", "Medium", "Heavy"] },
    { name: "Return Scrapr blade", variants: ["Steel", "Plastic", "PTFE"] },
    { name: "Machine frame DL298", variants: ["Cast", "Welded", "Low vibe"] },
    { name: "Table top anti-stick", variants: ["Laminate", "Teflon sheet", "Aluminium"] },
    { name: "Stand with casters", variants: ["Locking", "Heavy", "Leveling"] },
    { name: "LED strip work light", variants: ["Cool", "Daylight", "Dimmable"] },
    { name: "Wire harness DL298", variants: ["Basic", "Shielded", "Modular"] },
    { name: "Power supply DL298", variants: ["110V", "220V", "Universal"] },
    { name: "Cooling fan kit", variants: ["40mm", "60mm", "Filtered"] },
    { name: "Bearing kit rollers", variants: ["Sealed", "Needle", "Ceramic"] },
    { name: "Guide rail set", variants: ["Aluminium", "Steel", "Hard-coat"] },
    { name: "Clamp pad set", variants: ["Rubber", "Silicone", "Felt"] },
    { name: "Safety cover guard", variants: ["Clear", "Mesh", "Interlocked"] },
    { name: "Interlock microswitch", variants: ["NO", "NC", "Dual"] },
    { name: "Thermocouple probe", variants: ["Type J", "Type K", "Pt100"] },
    { name: "Glue filter screen", variants: ["Coarse", "Fine", "Disposable"] },
    { name: "Hose kit chemical", variants: ["1m", "2m", "PTFE lined"] },
    { name: "Quick coupler set", variants: ["Brass", "Stainless", "Plastic"] },
    { name: "Firmware chip DL298", variants: ["v2.1", "v2.5", "v3.0"] },
    { name: "Label plate DL298", variants: ["Engraved", "CE", "QR"] },
    { name: "Mounting hardware", variants: ["M5", "M6", "Mixed"] },
    { name: "Dust cover DL298", variants: ["Vinyl", "Canvas", "Hard"] },
    { name: "Spare roller pair", variants: ["Upper", "Lower", "Matched"] },
    { name: "Tension spring kit", variants: ["Light", "Medium", "Heavy"] },
    { name: "Side trim guide", variants: ["Fixed", "Micrometer", "Auto"] },
    { name: "Operator tool tray", variants: ["Side", "Magnetic", "Drawer"] },
    { name: "Maintenance kit DL298", variants: ["Basic", "Pro", "Annual"] },
    { name: "Grease pack rollers", variants: ["NLGI 2", "Food grade", "Synthetic"] },
    { name: "Relay / SSR board", variants: ["4-ch", "8-ch", "SSR"] },
  ],
  "DY 93/2K": [
    { name: "Button attaching head DY93", variants: ["Prong snap", "Plastic snap", "Dual mode"] },
    { name: "Prong snap die set", variants: ["10mm", "12mm", "15mm"] },
    { name: "Plastic snap die set", variants: ["T5", "T8", "Universal"] },
    { name: "Automatic button feeder", variants: ["Bowl", "Rail", "Vision assisted"] },
    { name: "Vibratory bowl feeder", variants: ["Small", "Medium", "Lined"] },
    { name: "Button track / rail", variants: ["Prong", "Plastic", "Convertible"] },
    { name: "Upper punch assembly", variants: ["Standard", "Hardened", "Quick-change"] },
    { name: "Lower anvil set", variants: ["Flat", "Domed", "Custom"] },
    { name: "Pneumatic press cylinder", variants: ["40mm", "50mm", "Double acting"] },
    { name: "Pressure regulator kit", variants: ["Manual", "Precision", "With gauge"] },
    { name: "Solenoid valve 5-way", variants: ["12V", "24V", "Silent"] },
    { name: "Air FRL unit DY93", variants: ["1/4\"", "3/8\"", "Lubricator"] },
    { name: "Photo eye button detect", variants: ["Diffuse", "Fiber", "Color"] },
    { name: "Presence sensor fabric", variants: ["Optical", "Capacitive", "Ultrasonic"] },
    { name: "Control PCB DY93/2K", variants: ["Rev B", "Rev C", "Safety"] },
    { name: "HMI counter panel", variants: ["LCD", "Touch", "Batch"] },
    { name: "Foot pedal cycle", variants: ["Single", "Dual", "Two-hand"] },
    { name: "Two-hand safety buttons", variants: ["Standard", "Illuminated", "Category 4"] },
    { name: "Emergency stop module", variants: ["Mushroom", "Dual channel", "Keyed"] },
    { name: "Main frame DY93", variants: ["Cast", "Welded", "Low vibration"] },
    { name: "Work table insert", variants: ["Nylon", "UHMW", "Steel"] },
    { name: "Stand / pedestal", variants: ["Fixed", "Caster", "Height adjust"] },
    { name: "LED ring light", variants: ["Cool", "Daylight", "Dimmable"] },
    { name: "Wire harness DY93", variants: ["Basic", "Shielded", "Modular"] },
    { name: "Power supply DY93", variants: ["110V", "220V", "Universal"] },
    { name: "Cooling fan kit", variants: ["40mm", "60mm", "Filtered"] },
    { name: "Die change tool kit", variants: ["Basic", "Pro", "Torque"] },
    { name: "Spare die springs", variants: ["Light", "Medium", "Heavy"] },
    { name: "Guide bushing set", variants: ["Bronze", "Polymer", "Hardened"] },
    { name: "Linear bearing kit", variants: ["LM8", "LM12", "Sealed"] },
    { name: "Safety guard interlock", variants: ["NO", "NC", "Dual"] },
    { name: "Clear safety shield", variants: ["Front", "Full", "Hinged"] },
    { name: "Button reject chute", variants: ["Left", "Right", "Bin"] },
    { name: "Collection bin", variants: ["Small", "Large", "Anti-static"] },
    { name: "Firmware chip DY93/2K", variants: ["v1.5", "v1.8", "v2.2"] },
    { name: "Label plate DY93/2K", variants: ["Engraved", "CE", "QR"] },
    { name: "Mounting hardware kit", variants: ["M5", "M6", "Mixed"] },
    { name: "Dust cover DY93", variants: ["Vinyl", "Canvas", "Hard"] },
    { name: "Silencer muffler set", variants: ["1/4\"", "3/8\"", "Quiet"] },
    { name: "Speed control muffler", variants: ["Inline", "Exhaust", "Precision"] },
    { name: "Proximity switch kit", variants: ["Inductive", "Magnetic", "Reed"] },
    { name: "Cycle counter module", variants: ["Mechanical", "Electronic", "Resettable"] },
    { name: "Lubrication point kit", variants: ["Grease", "Oil", "Dry"] },
    { name: "Spare punch tip pack", variants: ["Prong", "Plastic", "Mixed"] },
    { name: "Alignment jig plate", variants: ["Standard", "Offset", "Custom"] },
    { name: "Operator tool tray", variants: ["Side", "Magnetic", "Drawer"] },
    { name: "Maintenance kit DY93", variants: ["Daily", "Weekly", "Annual"] },
    { name: "Relay board DY93", variants: ["4-ch", "8-ch", "SSR"] },
    { name: "Cable gland pack", variants: ["M16", "M20", "Mixed"] },
    { name: "Anti-vibration pads", variants: ["Rubber", "Neoprene", "Leveling"] },
    { name: "Quick-change die latch", variants: ["Manual", "Pneumatic", "Tool-less"] },
    { name: "Button size change kit", variants: ["T5-T8", "10-15mm", "Universal"] },
  ],
}

const resolveBomCatalog = (product) => {
  if (MACHINE_BOM_CATALOGS[product.sku]) {
    return MACHINE_BOM_CATALOGS[product.sku]
  }

  const skuKey = Object.keys(MACHINE_BOM_CATALOGS).find(
    (key) => product.sku?.includes(key) || key.includes(product.sku),
  )

  return skuKey ? MACHINE_BOM_CATALOGS[skuKey] : null
}

const buildBomForProduct = (product) => {
  const catalog = resolveBomCatalog(product)

  if (!catalog) {
    return []
  }

  const modelTag = (product.model || product.sku || "GEN").replace(/\s+/g, "")

  return Array.from({ length: COMPONENTS_PER_MACHINE }, (_, index) => {
    const template = catalog[index % catalog.length]
    const seed = hashString(`${product.id}-bom-${index}-${template.name}`)
    const variant = template.variants[seed % template.variants.length]
    const componentNumber = String(index + 1).padStart(3, "0")
    const variantNumber = String((seed % 90) + 10).padStart(2, "0")

    return {
      id: `bom-${product.id}-${componentNumber}`,
      productId: product.id,
      componentId: `CMP-${modelTag}-${componentNumber}`,
      componentName: template.name,
      variantId: `VAR-${modelTag}-${componentNumber}-${variantNumber}`,
      variantName: variant,
      estimatedTimeToProcure: TIME_OPTIONS[seed % TIME_OPTIONS.length],
      vendorCount: 1 + (seed % 8),
    }
  })
}

/** Bill of materials for the first five catalog machines (52 machine-specific components each). */
export const PRODUCT_BOM = PRODUCTS.slice(0, BOM_MACHINE_COUNT).flatMap((product) =>
  buildBomForProduct(product),
)

const buildFacilityStockForComponent = (bomRow) => {
  const seed = hashString(`${bomRow.id}-facilities`)
  const facilityCount = 1 + (seed % FACILITIES.length)
  const start = seed % FACILITIES.length

  return Array.from({ length: facilityCount }, (_, offset) => {
    const facility = FACILITIES[(start + offset) % FACILITIES.length]
    const localSeed = hashString(`${bomRow.id}-${facility.id}`)
    const quantity = localSeed % 13 === 0 ? 0 : 2 + (localSeed % 48)
    const reserved = quantity === 0 ? 0 : localSeed % 4
    const available = Math.max(quantity - reserved, 0)
    const bin = facility.bins[localSeed % facility.bins.length]

    return {
      id: `cstk-${bomRow.id}-${facility.id}`,
      bomId: bomRow.id,
      componentId: bomRow.componentId,
      facilityId: facility.id,
      facilityCode: facility.code,
      facilityName: facility.name,
      city: facility.city,
      bin,
      quantity,
      reserved,
      available,
    }
  })
}

export const COMPONENT_FACILITY_STOCK = PRODUCT_BOM.flatMap(buildFacilityStockForComponent)

export const getBomForProduct = (productId) => {
  return PRODUCT_BOM.filter((row) => row.productId === productId)
}

export const getComponentFacilityStock = (bomId) => {
  return COMPONENT_FACILITY_STOCK.filter((row) => row.bomId === bomId)
}

export const hasBomCoverage = (productId) => {
  return PRODUCT_BOM.some((row) => row.productId === productId)
}

/**
 * Find BOM rows matching a free-text search (component / variant / ids).
 *
 * @param {string} query
 * @returns {Array<Object>}
 */
export const findBomMatches = (query = "") => {
  const normalized = query.trim().toLowerCase()

  if (!normalized) {
    return []
  }

  return PRODUCT_BOM.filter((row) => {
    const haystack =
      `${row.componentName} ${row.componentId} ${row.variantName} ${row.variantId}`.toLowerCase()
    return haystack.includes(normalized)
  })
}
