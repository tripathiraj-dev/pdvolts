import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting PdVolts database seed...");

  // Clean existing records in reverse dependency order
  await prisma.jobApplication.deleteMany();
  await prisma.career.deleteMany();
  await prisma.download.deleteMany();
  await prisma.certification.deleteMany();
  await prisma.galleryImage.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.faq.deleteMany();
  await prisma.blogPost.deleteMany();
  await prisma.enquiryNote.deleteMany();
  await prisma.quoteRequest.deleteMany();
  await prisma.enquiry.deleteMany();
  await prisma.savedProduct.deleteMany();
  await prisma.productSpecification.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.productCategory.deleteMany();
  await prisma.industry.deleteMany();
  await prisma.siteSetting.deleteMany();
  await prisma.user.deleteMany();

  console.log("Cleared existing data.");

  // 1. Seed Users
  const adminPasswordHash = await bcrypt.hash("Admin@12345", 10);
  const managerPasswordHash = await bcrypt.hash("Manager@12345", 10);
  const userPasswordHash = await bcrypt.hash("User@12345", 10);

  const superAdmin = await prisma.user.create({
    data: {
      name: "PDVolts Super Admin",
      email: "admin@pdvolts.com",
      password: adminPasswordHash,
      phone: "+91 98765 43210",
      company: "PDVolts Industries Ltd.",
      role: "SUPER_ADMIN",
      isActive: true,
    },
  });

  const opsManager = await prisma.user.create({
    data: {
      name: "PDVolts Operations Manager",
      email: "manager@pdvolts.com",
      password: managerPasswordHash,
      phone: "+91 98765 43211",
      company: "PDVolts Industries Ltd.",
      role: "ADMIN",
      isActive: true,
    },
  });

  const demoUser = await prisma.user.create({
    data: {
      name: "Marcus Vance",
      email: "user@pdvolts.com",
      password: userPasswordHash,
      phone: "+1 (555) 234-5678",
      company: "Apex Electrical Infrastructure Corp.",
      role: "USER",
      isActive: true,
    },
  });

  console.log("Seeded Users:", {
    superAdmin: superAdmin.email,
    opsManager: opsManager.email,
    demoUser: demoUser.email,
  });

  // 2. Seed Product Categories
  const categories = await Promise.all([
    prisma.productCategory.create({
      data: {
        name: "Industrial Power Cables",
        slug: "industrial-power-cables",
        description: "Heavy-duty low and medium voltage power distribution cables for industrial utilities and grid networks.",
        image: "https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=800&q=80",
        order: 1,
      },
    }),
    prisma.productCategory.create({
      data: {
        name: "Building & Flexible Wires",
        slug: "building-flexible-wires",
        description: "High-grade electrolytic copper wires insulated with flame-retardant PVC for commercial and residential panels.",
        image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
        order: 2,
      },
    }),
    prisma.productCategory.create({
      data: {
        name: "Control & Instrumentation Cables",
        slug: "control-instrumentation-cables",
        description: "Shielded and screened multicore cables engineered for process automation, sensors, and telemetry systems.",
        image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
        order: 3,
      },
    }),
    prisma.productCategory.create({
      data: {
        name: "Plastic & Polymer Components",
        slug: "plastic-polymer-components",
        description: "Precision injection-molded terminal blocks, connectors, industrial grommets, and heat-resistant bushings.",
        image: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80",
        order: 4,
      },
    }),
    prisma.productCategory.create({
      data: {
        name: "Custom Extrusions & Conduits",
        slug: "custom-extrusions-conduits",
        description: "Rigid and corrugated PVC conduit pipes, spiral wire guards, and high-impact polymer profiles.",
        image: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80",
        order: 5,
      },
    }),
  ]);

  console.log("Seeded Categories:", categories.length);

  // 3. Seed Products (12 Products)
  const p1 = await prisma.product.create({
    data: {
      name: "Heavy-Duty Armored XLPE Power Cable",
      slug: "armored-xlpe-power-cable",
      categoryId: categories[0].id,
      shortDescription: "Multicore steel wire armored (SWA) power cable with cross-linked polyethylene insulation for underground power transmission.",
      fullDescription: "Engineered for harsh industrial environments, petrochemical plants, and underground power distribution. The cross-linked polyethylene (XLPE) dielectric provides superior thermal and mechanical performance up to 90°C continuous operating temperature. Galvanized steel wire armoring offers outstanding mechanical protection against crushing and rodent damage.",
      sku: "PD-XLPE-4C-50",
      moq: "500 Meters",
      material: "Class 2 Stranded Copper / XLPE / Extruded PVC / Galvanized SWA",
      size: "16 sq.mm to 400 sq.mm (3C, 3.5C & 4C)",
      color: "Black Outer Sheath, Color-Coded Inner Cores",
      voltageRating: "0.6/1.1 kV (Tested up to 3.5 kV)",
      application: "Underground Power Grids, Heavy Industrial Substations, Direct Burial",
      packaging: "Heavy Duty Returnable Wooden Drums (500m / 1000m)",
      isFeatured: true,
      isActive: true,
      seoTitle: "Armored XLPE Industrial Power Cable - PdVolts",
      seoDescription: "Explore heavy duty armored XLPE power cables engineered for harsh industrial utilities and underground distribution.",
      images: {
        create: [
          { url: "https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=800&q=80", altText: "Armored XLPE Cable Cross Section", isPrimary: true, order: 1 },
          { url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80", altText: "Cable Drum Delivery", isPrimary: false, order: 2 },
        ],
      },
      specifications: {
        create: [
          { key: "Conductor", value: "Class 2 Electrolytic Stranded Plain Copper", unit: "IEC 60228", order: 1 },
          { key: "Insulation", value: "XLPE (Cross-linked Polyethylene)", unit: "90°C Rated", order: 2 },
          { key: "Armor Type", value: "Galvanized Steel Wire Armor (SWA)", unit: "BS 5467", order: 3 },
          { key: "Outer Sheath", value: "Flame Retardant UV-Stabilized PVC Type ST2", unit: "", order: 4 },
          { key: "Operating Temp", value: "-25°C to +90°C", unit: "Celsius", order: 5 },
          { key: "Short Circuit Temp", value: "+250°C (up to 5 seconds)", unit: "Celsius", order: 6 },
        ],
      },
    },
  });

  const p2 = await prisma.product.create({
    data: {
      name: "Multicore Flexible Copper Cable",
      slug: "multicore-flexible-copper-cable",
      categoryId: categories[1].id,
      shortDescription: "Ultra-flexible bright annealed copper conductor multicore cable for machinery, automation, and portable industrial tools.",
      fullDescription: "High-grade flexible multicore cable manufactured using finely stranded high-conductivity electrolytic copper conductors. Insulated and sheathed with proprietary oil-resistant, high-flexibility PVC compounds to withstand repetitive flexing and mechanical vibrations.",
      sku: "PD-FLEX-MC-04",
      moq: "300 Meters",
      material: "Class 5 Pure Bare Copper / Flexible PVC Type A",
      size: "0.75 sq.mm to 10 sq.mm (2 to 24 Cores)",
      color: "Grey / Black Outer Sheath",
      voltageRating: "1100V AC",
      application: "Industrial Machinery, CNC Systems, Automation Panels, Mobile Equipment",
      packaging: "100m Coils & 500m Wooden Spools",
      isFeatured: true,
      isActive: true,
      seoTitle: "Multicore Flexible Copper Cable - Industrial Machine Wiring",
      seoDescription: "Industrial grade flexible multicore copper cables designed for continuous flexing and machinery.",
      images: {
        create: [
          { url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80", altText: "Flexible Multicore Cable Bundles", isPrimary: true, order: 1 },
        ],
      },
      specifications: {
        create: [
          { key: "Conductor Class", value: "Class 5 Flexible Fine Wire", unit: "IEC 60228", order: 1 },
          { key: "Insulation Material", value: "Flame Retardant Flexible PVC", unit: "IS 5831", order: 2 },
          { key: "Bending Radius", value: "6 x Cable Diameter", unit: "mm", order: 3 },
          { key: "Oil Resistance", value: "Excellent against mineral lubricants", unit: "", order: 4 },
        ],
      },
    },
  });

  const p3 = await prisma.product.create({
    data: {
      name: "Submersible 3-Core Flat Cable",
      slug: "submersible-3-core-flat-cable",
      categoryId: categories[0].id,
      shortDescription: "Water-impermeable flat copper cable designed specifically for deep well submersible water pumps and agricultural installations.",
      fullDescription: "Crafted to endure continuous underwater submersion, oil ingress, and abrasive mineral conditions in deep borewells. Featuring high-dielectric waterproof grade PVC inner insulation and a tough, abrasion-resistant outer jacket.",
      sku: "PD-SUB-3C-04",
      moq: "500 Meters",
      material: "Bright Annealed High Purity Copper / Waterproof PVC",
      size: "1.5, 2.5, 4.0, 6.0, 10.0, 16.0, 25.0 sq.mm",
      color: "Blue Outer Sheath",
      voltageRating: "1100 Volts",
      application: "Submersible Water Pumps, Irrigation Wells, Deep Mine Dewatering",
      packaging: "500m / 1000m Wooden Drums",
      isFeatured: true,
      isActive: true,
      images: {
        create: [
          { url: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80", altText: "Submersible Flat Cable", isPrimary: true, order: 1 },
        ],
      },
      specifications: {
        create: [
          { key: "Submersion Rating", value: "Continuous IP68 Submersion up to 500m Depth", unit: "", order: 1 },
          { key: "Conductor", value: "High Conductivity EC Grade Annealed Copper", unit: "99.97% Pure", order: 2 },
          { key: "Insulation Type", value: "Water Resistant Special Grade PVC", unit: "", order: 3 },
        ],
      },
    },
  });

  const p4 = await prisma.product.create({
    data: {
      name: "Single Core FR PVC Insulated Wire",
      slug: "single-core-fr-pvc-insulated-wire",
      categoryId: categories[1].id,
      shortDescription: "Premium flame-retardant (FR) single core building and panel wire with high oxygen index for superior fire safety.",
      fullDescription: "PdVolts FR wires are manufactured with 99.97% pure electrolytic grade copper conductors and insulated with special flame retardant PVC compound. In case of fire, the compound self-extinguishes and restricts the propagation of flames, dramatically improving safety in commercial high-rises and factories.",
      sku: "PD-WIRE-FR-25",
      moq: "1,000 Meters",
      material: "Electrolytic Bare Copper / Fire-Retardant PVC (LOI > 29%)",
      size: "0.5 to 35 sq.mm",
      color: "Red, Yellow, Blue, Black, Green, White",
      voltageRating: "Up to 1100 V AC",
      application: "Commercial Panels, Switchboards, High-Rise Conduit Wiring",
      packaging: "90m Coils / 180m Project Spools",
      isFeatured: true,
      isActive: true,
      images: {
        create: [
          { url: "https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=800&q=80", altText: "FR Single Core Wire Spools", isPrimary: true, order: 1 },
        ],
      },
      specifications: {
        create: [
          { key: "Oxygen Index", value: "Greater than 29%", unit: "ASTM D 2863", order: 1 },
          { key: "Temperature Index", value: "Min 250°C", unit: "ASTM D 2863", order: 2 },
          { key: "Max Conductor Temp", value: "70°C Continuous / 160°C Short-Circuit", unit: "", order: 3 },
        ],
      },
    },
  });

  const p5 = await prisma.product.create({
    data: {
      name: "Overall Screened Instrumentation Cable",
      slug: "overall-screened-instrumentation-cable",
      categoryId: categories[2].id,
      shortDescription: "Shielded multicore/multipair instrumentation cable for interference-free analog & digital signal telemetry.",
      fullDescription: "Specifically engineered for critical signal transfer in automated process plants, power stations, and refineries where electrical noise and EMI (electromagnetic interference) are prevalent. Features aluminum mylar screening tape with 100% electrostatic coverage and a tinned copper drain wire.",
      sku: "PD-INST-12PR",
      moq: "500 Meters",
      material: "Annealed Plain Copper / Polyethylene or PVC / AL-Mylar Tape Screen",
      size: "0.5, 0.75, 1.0, 1.5 sq.mm (1 to 50 Pairs/Triads)",
      color: "Blue (IS) or Black (Non-IS) Outer Sheath",
      voltageRating: "300V / 500V",
      application: "SCADA Systems, DCS Interconnects, Flow Sensors, Petrochemical Plants",
      packaging: "500m / 1000m Wooden Drums",
      isFeatured: false,
      isActive: true,
      images: {
        create: [
          { url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80", altText: "Shielded Cable Layers", isPrimary: true, order: 1 },
        ],
      },
      specifications: {
        create: [
          { key: "Screening Coverage", value: "100% Aluminum-Mylar Tape with Drain Wire", unit: "", order: 1 },
          { key: "Pair Identification", value: "Numbered Cores / Color Coded Pairs", unit: "", order: 2 },
          { key: "Cross-Talk Attenuation", value: "> 75 dB at 1 kHz", unit: "dB", order: 3 },
        ],
      },
    },
  });

  const p6 = await prisma.product.create({
    data: {
      name: "High-Temperature Silicone Insulated Wire",
      slug: "high-temperature-silicone-insulated-wire",
      categoryId: categories[1].id,
      shortDescription: "Silicone rubber insulated single core wire for extreme heat applications up to +200°C.",
      fullDescription: "Fabricated with tinned copper conductors and high-grade vulcanized silicone rubber insulation. Exhibits outstanding resistance to thermal stress, UV radiation, ozone, chemicals, and mechanical aging in high-temperature ovens, steel mills, and lighting fixtures.",
      sku: "PD-SIL-TEMP-16",
      moq: "500 Meters",
      material: "Tinned Flexible Copper / High-Purity Silicone Rubber",
      size: "0.5 sq.mm to 25 sq.mm",
      color: "White, Red, Black, Blue, Brown",
      voltageRating: "600V / 1000V",
      application: "Industrial Ovens, Metallurgy, Lighting, Power Generators, Boiler Plants",
      packaging: "100m Coils",
      isFeatured: false,
      isActive: true,
      images: {
        create: [
          { url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80", altText: "Silicone Insulated Wire", isPrimary: true, order: 1 },
        ],
      },
      specifications: {
        create: [
          { key: "Thermal Endurance", value: "-60°C to +200°C (peaks up to 250°C)", unit: "", order: 1 },
          { key: "Dielectric Strength", value: "20 kV/mm", unit: "kV/mm", order: 2 },
          { key: "Halogen Free", value: "Yes, zero toxic fumes when burned", unit: "IEC 60754-1", order: 3 },
        ],
      },
    },
  });

  const p7 = await prisma.product.create({
    data: {
      name: "Rigid PVC Electrical Conduit Pipes & Fittings",
      slug: "rigid-pvc-electrical-conduit-pipes",
      categoryId: categories[4].id,
      shortDescription: "High-impact unplasticized PVC (uPVC) conduit pipes and molded junction boxes for surface and embedded cabling.",
      fullDescription: "Manufactured from virgin polymer formulation engineered to withstand heavy compressive loads and impact. Completely non-conductive, dielectric, and rustproof, making them the industry choice for industrial concrete embedment and chemical plants.",
      sku: "PD-UPVC-CND-25",
      moq: "200 Units (3m lengths)",
      material: "High Impact Virgin uPVC Resin",
      size: "20mm, 25mm, 32mm, 40mm, 50mm Outer Diameter",
      color: "Grey / White / Black",
      voltageRating: "Dielectric insulation > 2000V",
      application: "Industrial Plant Wiring, Concrete Slab Embedment, Outdoor Walls",
      packaging: "Bundles of 25 / 50 Pipes (3m per pipe)",
      isFeatured: true,
      isActive: true,
      images: {
        create: [
          { url: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80", altText: "Rigid uPVC Conduit Pipes", isPrimary: true, order: 1 },
        ],
      },
      specifications: {
        create: [
          { key: "Compressive Strength", value: "Medium Duty (750N) & Heavy Duty (1250N)", unit: "IEC 61386-21", order: 1 },
          { key: "Flame Spread", value: "Self-extinguishing within 30 seconds", unit: "", order: 2 },
          { key: "Standard Length", value: "3.00 Meters with Pre-Formed Socket", unit: "", order: 3 },
        ],
      },
    },
  });

  const p8 = await prisma.product.create({
    data: {
      name: "Precision Injection Molded Terminal Blocks",
      slug: "precision-molded-terminal-blocks",
      categoryId: categories[3].id,
      shortDescription: "Flame-retardant polyamide (PA66) modular DIN-rail terminal blocks with brass nickel-plated clamping.",
      fullDescription: "High-temperature injection molded modular terminal blocks designed for control cabinets and power distribution boards. Engineered with UL94 V-0 polyamide housing providing high tracking resistance and mechanical toughness.",
      sku: "PD-TERM-PA66-10",
      moq: "1,000 Units",
      material: "Polyamide PA66 (UL94 V-0) / Nickel-Plated Brass",
      size: "Wire cross section: 2.5mm² to 35mm²",
      color: "Grey, Blue, Yellow-Green (Grounding)",
      voltageRating: "1000V IEC / 600V UL",
      application: "Industrial Control Cabinets, Switchgear, Automation Panels",
      packaging: "Boxes of 50 / 100 units",
      isFeatured: true,
      isActive: true,
      images: {
        create: [
          { url: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80", altText: "Molded Terminal Blocks", isPrimary: true, order: 1 },
        ],
      },
      specifications: {
        create: [
          { key: "Flammability Rating", value: "UL94 V-0", unit: "", order: 1 },
          { key: "Current Carrying", value: "Up to 125 Amperes", unit: "A", order: 2 },
          { key: "Mounting Type", value: "Standard 35mm DIN Rail (TH35)", unit: "", order: 3 },
        ],
      },
    },
  });

  const p9 = await prisma.product.create({
    data: {
      name: "Halogen-Free Solar PV Cable (EN 50618)",
      slug: "halogen-free-solar-pv-cable",
      categoryId: categories[0].id,
      shortDescription: "Dual-certified TÜV / EN 50618 cross-linked polyolefin solar cables for rooftop and utility-scale photovoltaic arrays.",
      fullDescription: "Engineered specifically for solar installations where cables are subject to 25+ years of intense UV radiation, ozone exposure, and extreme weather cycling. Electron-beam cross-linked compound ensures zero melting during overcurrent conditions.",
      sku: "PD-SOLAR-H1Z2-4",
      moq: "500 Meters",
      material: "Tinned Electrolytic Copper / Cross-Linked Polyolefin (XLPO)",
      size: "4.0 mm² and 6.0 mm² (Single Core)",
      color: "Black / Red Outer Sheath",
      voltageRating: "1.5 kV DC (1.8 kV Max)",
      application: "Photovoltaic Inverter Wiring, Rooftop Solar Arrays, Solar Farms",
      packaging: "500m / 1000m Wooden Drums",
      isFeatured: true,
      isActive: true,
      images: {
        create: [
          { url: "https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80", altText: "Solar PV Cable Reels", isPrimary: true, order: 1 },
        ],
      },
      specifications: {
        create: [
          { key: "Design Life", value: "Expected service life > 25 Years at 90°C", unit: "", order: 1 },
          { key: "UV Resistance", value: "EN 50618 Annex E Certified", unit: "", order: 2 },
          { key: "Halogen Free", value: "Zero Halogen (LSZH), EN 50525-1", unit: "", order: 3 },
        ],
      },
    },
  });

  const p10 = await prisma.product.create({
    data: {
      name: "Heavy-Duty Spiral Nylon Cable Glands",
      slug: "spiral-nylon-cable-glands",
      categoryId: categories[3].id,
      shortDescription: "IP68 waterproof strain-relief nylon spiral cable glands protecting flexible cords against severe bend stress.",
      fullDescription: "Injection molded from virgin Nylon PA66 with NBR hermetic seals. The extended spiral tail dissipates bending stresses across flexible wires entering junction boxes or heavy equipment, preventing copper fatigue and wire breakage.",
      sku: "PD-GLAND-M20S",
      moq: "500 Units",
      material: "Nylon 66 (UL94 V-2) / NBR Rubber Seal",
      size: "Metric M12, M16, M20, M25 and PG Threads",
      color: "Black / Light Grey",
      voltageRating: "Dielectric strength > 25 kV/mm",
      application: "Handheld Power Tools, Robotic Arms, Weatherproof Enclosures",
      packaging: "Bags of 100 Units",
      isFeatured: false,
      isActive: true,
      images: {
        create: [
          { url: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80", altText: "Nylon Spiral Cable Gland", isPrimary: true, order: 1 },
        ],
      },
      specifications: {
        create: [
          { key: "Ingress Protection", value: "IP68 (5 bar pressure resistance)", unit: "IEC 60529", order: 1 },
          { key: "Working Temperature", value: "-40°C to +100°C continuous", unit: "", order: 2 },
        ],
      },
    },
  });

  const p11 = await prisma.product.create({
    data: {
      name: "Corrugated Polyethylene (PE) Split Sleeving",
      slug: "corrugated-pe-split-sleeving",
      categoryId: categories[4].id,
      shortDescription: "Flexible slit corrugated tubing for bundling and abrasion protection of automotive and cabinet wire harnesses.",
      fullDescription: "Continuous extruded high-density polyethylene protective loom. The longitudinal split allows effortless retrofit installation over pre-terminated wire bundles without disconnecting terminals.",
      sku: "PD-LOOM-PE-19",
      moq: "500 Meters",
      material: "Modified High Density Polyethylene (HDPE)",
      size: "Internal Diameter: 7mm, 10mm, 14mm, 19mm, 25mm, 32mm",
      color: "Black with UV stabilizers",
      voltageRating: "Dielectric breakdown > 30 kV",
      application: "Automotive Engine Harnesses, Commercial Vehicle Routing, Data Centers",
      packaging: "100m Coils in Protective Dispenser Cartons",
      isFeatured: false,
      isActive: true,
      images: {
        create: [
          { url: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80", altText: "Corrugated Wire Loom", isPrimary: true, order: 1 },
        ],
      },
      specifications: {
        create: [
          { key: "Crush Resistance", value: "High flexibility with 350N recovery", unit: "", order: 1 },
          { key: "Chemical Resistance", value: "Resistant to motor oils, fuels, battery acids", unit: "", order: 2 },
        ],
      },
    },
  });

  const p12 = await prisma.product.create({
    data: {
      name: "Industrial PVC Masterbatch & Compounding Pellets",
      slug: "pvc-masterbatch-compounding-pellets",
      categoryId: categories[3].id,
      shortDescription: "Customized color and flame-retardant virgin PVC pellets for cable extrusion and technical profile injection molding.",
      fullDescription: "PdVolts operates an advanced compounding facility producing tailored masterbatches and thermoplastic PVC compounds. Custom formulations include high LOI flame retardance, low smoke zero halogen (LSZH), heat stabilization, and UV resistance.",
      sku: "PD-CMPD-FR90",
      moq: "1,000 Kilograms (1 MT)",
      material: "Virgin Suspension PVC Resin (K-value 67-70) + Plasticizers & Additives",
      size: "Uniform 3mm Pellets",
      color: "Natural, Black, Red, Custom RAL/Pantone Matching",
      voltageRating: "Formulated for LV/MV cable standards",
      application: "Cable Extrusion Houses, Injection Molders, Automotive Extrusions",
      packaging: "25kg Moisture-Proof Multi-Ply Bags / 1000kg Big Bags",
      isFeatured: true,
      isActive: true,
      images: {
        create: [
          { url: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80", altText: "PVC Compounding Pellets", isPrimary: true, order: 1 },
        ],
      },
      specifications: {
        create: [
          { key: "Specific Gravity", value: "1.38 ± 0.03 g/cm³", unit: "ASTM D 792", order: 1 },
          { key: "Hardness (Shore A)", value: "85 ± 3", unit: "ASTM D 2240", order: 2 },
          { key: "Tensile Strength", value: "Min 15.5 MPa", unit: "ASTM D 638", order: 3 },
        ],
      },
    },
  });

  console.log("Seeded 12 Products successfully.");

  // 4. Seed Industries (5 Industries)
  await Promise.all([
    prisma.industry.create({
      data: {
        title: "Power & Electrical Utilities",
        slug: "power-electrical-utilities",
        summary: "Transmission and substation cabling engineered to endure extreme thermal loads and grid conditions.",
        description: "From primary distribution sub-stations to local transformer step-downs, PdVolts heavy-duty XLPE power cables and copper conductors provide the dependable backbone for municipal and industrial utilities.",
        icon: "Zap",
        imageUrl: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80",
        order: 1,
      },
    }),
    prisma.industry.create({
      data: {
        title: "Automotive & Heavy Vehicles",
        slug: "automotive-heavy-vehicles",
        summary: "High-flex wires and thermal-resistant polymer conduit looms for vehicle harnesses.",
        description: "Our thin-wall automotive primary wires and split corrugated conduit systems protect critical sensor, engine control, and battery telemetry harnesses from vibration and motor fluids.",
        icon: "Car",
        imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80",
        order: 2,
      },
    }),
    prisma.industry.create({
      data: {
        title: "Construction & Commercial Infrastructure",
        slug: "construction-commercial-infrastructure",
        summary: "Flame-retardant building wires and uPVC conduits ensuring occupant life safety.",
        description: "Supplying premier EPC infrastructure contractors with rigorously tested single-core FR wires, rigid conduit pipes, and molded junction boxes designed for high-rise residential and commercial developments.",
        icon: "Building2",
        imageUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb186c5f8?auto=format&fit=crop&w=800&q=80",
        order: 3,
      },
    }),
    prisma.industry.create({
      data: {
        title: "Renewable Energy & Solar Parks",
        slug: "renewable-energy-solar-parks",
        summary: "TÜV certified photovoltaic DC cables resisting decades of extreme UV and temperature fluctuations.",
        description: "Powering gigawatt-scale solar installations across North America and Europe with EN 50618 halogen-free solar cables engineered for 25+ years of continuous outdoor solar radiation.",
        icon: "Sun",
        imageUrl: "https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80",
        order: 4,
      },
    }),
    prisma.industry.create({
      data: {
        title: "OEM Machinery & Industrial Automation",
        slug: "oem-machinery-industrial-automation",
        summary: "Shielded instrumentation cabling and custom molded terminal hardware for automation.",
        description: "Precision-engineered control cabling and PA66 terminal blocks that eliminate signal crosstalk and keep robotic cells, CNC machine tools, and SCADA monitoring systems operating continuously.",
        icon: "Cpu",
        imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
        order: 5,
      },
    }),
  ]);

  console.log("Seeded Industries.");

  // 5. Seed Certifications
  await Promise.all([
    prisma.certification.create({
      data: {
        title: "ISO 9001:2015 Quality Management",
        issuingBody: "Bureau Veritas International",
        certificateNumber: "BVI-QMS-99421-US",
        validUntil: "2028-10-15",
        fileUrl: "/downloads/certs/iso-9001-pdvolts.pdf",
        imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80",
        description: "Certified comprehensive quality control protocols spanning raw electrolytic copper assay to automated extrusion laser diameter verification.",
        isFeatured: true,
      },
    }),
    prisma.certification.create({
      data: {
        title: "ISO 14001:2015 Environmental System",
        issuingBody: "TÜV SÜD Industrial Certification",
        certificateNumber: "TUV-EMS-88310-24",
        validUntil: "2027-06-30",
        fileUrl: "/downloads/certs/iso-14001-pdvolts.pdf",
        imageUrl: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=600&q=80",
        description: "Zero-landfill polymer recycling initiatives and closed-loop process cooling water loops throughout our 120,000 sq.ft. manufacturing plants.",
        isFeatured: true,
      },
    }),
    prisma.certification.create({
      data: {
        title: "CE Conformity Declaration",
        issuingBody: "European Commission Notified Body",
        certificateNumber: "CE-LVD-2014-35-EU",
        validUntil: "2029-01-01",
        fileUrl: "/downloads/certs/ce-conformity-pdvolts.pdf",
        imageUrl: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=600&q=80",
        description: "Full compliance with Low Voltage Directive (LVD 2014/35/EU) and Construction Products Regulation (CPR EN 50575) for European exports.",
        isFeatured: true,
      },
    }),
    prisma.certification.create({
      data: {
        title: "RoHS & REACH Chemical Compliance",
        issuingBody: "SGS Laboratories",
        certificateNumber: "SGS-CHEM-ROHS-4491",
        validUntil: "2027-12-31",
        fileUrl: "/downloads/certs/rohs-reach-pdvolts.pdf",
        imageUrl: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=600&q=80",
        description: "Certified free of hazardous lead, mercury, cadmium, hexavalent chromium, and restricted phthalates across all wire sheathing and plastic components.",
        isFeatured: true,
      },
    }),
  ]);

  console.log("Seeded Certifications.");

  // 6. Seed Testimonials
  await Promise.all([
    prisma.testimonial.create({
      data: {
        clientName: "David Sterling",
        company: "Vanguard Infrastructure EPC",
        position: "Chief Electrical Engineer",
        content: "PdVolts supplied over 85 kilometers of armored XLPE and control cables for our terminal port expansion. Their batch consistency, zero dielectric faults on hi-pot testing, and on-time drum dispatch saved our schedule three weeks.",
        rating: 5,
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
        isPublished: true,
        order: 1,
      },
    }),
    prisma.testimonial.create({
      data: {
        clientName: "Elena Rostova",
        company: "Helios Renewable Energy Systems",
        position: "VP of Procurement",
        content: "Solar PV cables must endure the most brutal environmental cycling. PdVolts dual-certified EN 50618 solar cables have demonstrated unmatched resistance to UV degradation across our 220MW desert solar farms.",
        rating: 5,
        avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80",
        isPublished: true,
        order: 2,
      },
    }),
    prisma.testimonial.create({
      data: {
        clientName: "Robert Chen",
        company: "Apex Automation & Robotics Ltd.",
        position: "Plant Technical Director",
        content: "We switched to PdVolts precision molded PA66 terminal blocks and shielded multicore cables two years ago. Their rejection rate is virtually zero, and their custom compounding service delivered the exact flame rating our automotive client specified.",
        rating: 5,
        avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
        isPublished: true,
        order: 3,
      },
    }),
  ]);

  console.log("Seeded Testimonials.");

  // 7. Seed FAQs
  await Promise.all([
    prisma.faq.create({
      data: {
        question: "What standards and international certifications do PdVolts products comply with?",
        answer: "Our wires, industrial cables, and polymer formulations strictly comply with global industry benchmarks including IEC 60228, IEC 60502, BS 5467, EN 50618 (Solar PV), UL 83, and ISO 9001:2015. Every manufacturing batch undergoes full dielectric withstand, tensile elongation, and flame propagation tests in our NABL/ISO accredited testing laboratory.",
        category: "Quality",
        order: 1,
      },
    }),
    prisma.faq.create({
      data: {
        question: "Can PdVolts manufacture custom cable constructions or specialized plastic compounds?",
        answer: "Yes. In addition to our 500+ standard product catalog, our engineering team routinely formulates custom solutions including custom conductor strandings, oil-resistant PUR outer sheaths, low smoke zero halogen (LSZH) compounds, custom masterbatch coloration, and precision injection-molded polymer components.",
        category: "Technical",
        order: 2,
      },
    }),
    prisma.faq.create({
      data: {
        question: "What is your Minimum Order Quantity (MOQ) and production lead time?",
        answer: "Standard catalog wires and conduits maintained in inventory carry an MOQ of 300 to 500 meters or 1 standard drum, dispatched within 48 to 72 hours. Custom engineered cable runs or specialized polymer masterbatch compounding generally require an MOQ of 1,000 to 2,000 meters / 1 MT, with typical factory production cycles between 10 to 18 business days.",
        category: "Orders",
        order: 3,
      },
    }),
    prisma.faq.create({
      data: {
        question: "Do you supply Type Test Certificates and batch inspection reports with dispatches?",
        answer: "Every shipment is accompanied by a formal Certificate of Analysis (CoA), Routine Test Report (RTR), and mill test certificate verifying copper purity, insulation thickness, spark test results, and insulation resistance readings. Third-party witness testing (e.g., Lloyd's, SGS, Bureau Veritas) is readily arranged upon request.",
        category: "Quality",
        order: 4,
      },
    }),
    prisma.faq.create({
      data: {
        question: "How are export shipments packaged to prevent transit damage?",
        answer: "Cables are spooled onto heat-treated, fumigated ISPM-15 export wooden drums with protective lagged wooden battens or high-density plastic wrap. Conduit pipes are bundled in reinforced nylon strapping with end-protective caps. All containerized shipments are moisture-desiccated and palletized.",
        category: "Orders",
        order: 5,
      },
    }),
  ]);

  console.log("Seeded FAQs.");

  // 8. Seed Blog Posts
  await Promise.all([
    prisma.blogPost.create({
      data: {
        title: "Selecting the Right Cable Insulation: PVC vs. XLPE for Industrial Power Distribution",
        slug: "selecting-cable-insulation-pvc-vs-xlpe",
        excerpt: "A comprehensive technical comparison of thermal endurance, short-circuit current thresholds, and cost factors when designing plant power feeders.",
        content: `
### Introduction

In industrial power engineering, selecting the optimal dielectric material directly dictates the longevity, current-carrying capacity, and fire resilience of your electrical infrastructure. While standard Polyvinyl Chloride (PVC) has remained the traditional industrial workhorse for decades, Cross-Linked Polyethylene (XLPE) has increasingly become the definitive benchmark for heavy-duty commercial and utility power feeders.

### Chemical Structure & Thermal Performance

The fundamental distinction lies in cross-linking. In XLPE, polymer chains are chemically bonded into a 3-dimensional thermoset lattice through continuous curing. Unlike PVC, which is a thermoplastic that softens when exposed to elevated temperatures, XLPE retains mechanical stability up to significantly higher thermal thresholds:

* **Continuous Operating Temperature**: PVC is limited to 70°C, whereas XLPE safely operates continuously at 90°C.
* **Emergency Overload Limit**: XLPE can withstand short duration overloads up to 130°C without permanent conductor deformation.
* **Short-Circuit Rating**: Under momentary fault currents (up to 5 seconds), XLPE withstands up to 250°C compared to only 160°C for conventional PVC.

### Current Carrying Capacity (Ampacity)

Because XLPE permits a 20°C higher conductor operating temperature, cables insulated with XLPE deliver an approximate **15% to 25% higher current-carrying capacity** compared to an identically sized PVC cable. For EPC contractors designing large industrial power distribution networks, this often allows specifying a smaller conductor cross-section, yielding substantial savings in total copper weight and structural tray loading.

### Conclusion

For internal control wiring and general building circuits with moderate electrical loads, high-grade Flame Retardant (FR) PVC remains highly economical. However, for primary utility feeds, underground direct burial, and severe duty cycles, XLPE armored cables deliver superior ROI and decades of fault-free operation.
        `,
        coverImage: "https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=800&q=80",
        category: "Technical Guide",
        tags: "XLPE, PVC, Power Cables, Engineering, High Voltage",
        isPublished: true,
        seoTitle: "PVC vs XLPE Cable Insulation Technical Comparison - PdVolts",
        seoDescription: "Learn how XLPE and PVC cable insulation compare in thermal performance, current carrying capacity, and industrial durability.",
      },
    }),
    prisma.blogPost.create({
      data: {
        title: "Advances in Halogen-Free Flame Retardant (HFFR) Compounds for Public Safety",
        slug: "advances-in-halogen-free-flame-retardant-compounds",
        excerpt: "How modern polymer formulation eliminates corrosive acid gas generation and toxic dense smoke in modern high-density transit and datacenter facilities.",
        content: `
### The Hidden Danger of Traditional Plastics in Fires

During an electrical enclosure or cable trench fire, statistics show that over 80% of fatalities are caused not by radiant heat, but by the inhalation of toxic, opaque gases. Traditional PVC sheathing contains chlorine atoms. When ignited, it releases dense hydrochloric acid (HCl) gas, which is both lethal to human lungs and catastrophically corrosive to delicate electronic switchgear and computer servers.

### The Science of Low Smoke Zero Halogen (LSZH / HFFR)

PdVolts engineering team has developed proprietary Halogen-Free Flame Retardant (HFFR) polyolefin compounds. Instead of chlorine or bromine based flame retardants, our compounds incorporate mineral hydrates:

1. **Aluminum Trihydrate (ATH)** and **Magnesium Dihydroxide (MDH)**
2. Upon thermal exposure, these minerals undergo an endothermic decomposition, releasing bound water vapor that cools the flame front.
3. The remaining metal oxide forms an inert, protective char layer that deprives underlying polymers of oxygen and thermal energy.

### Global Mandates & Standards

Major infrastructure specifications—including London Underground, NFPA 130 for transit systems, and European CPR Euroclass regulations—now strictly mandate halogen-free cables in enclosed spaces. Discover how PdVolts HFFR certified cables ensure compliance and human safety.
        `,
        coverImage: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80",
        category: "Polymer Science",
        tags: "HFFR, LSZH, Fire Safety, Polymer Science, CPR",
        isPublished: true,
      },
    }),
  ]);

  console.log("Seeded Blog Posts.");

  // 9. Seed Downloads
  await Promise.all([
    prisma.download.create({
      data: {
        title: "2026 PdVolts Comprehensive Industrial Catalog",
        category: "Catalogues",
        description: "Full 140-page product directory covering wire dimensions, cable ampacity charts, conduit sizing, and polymer specs.",
        fileUrl: "/downloads/pdvolts-full-catalog-2026.pdf",
        fileSize: "14.2 MB",
        downloadCount: 342,
        isPublished: true,
      },
    }),
    prisma.download.create({
      data: {
        title: "Copper Conductor Resistance & Ampacity Technical Guide",
        category: "Datasheets",
        description: "Engineering lookup tables for voltage drop, derating factors for ambient temperature, and grouped conduit installation.",
        fileUrl: "/downloads/pdvolts-ampacity-engineering-tables.pdf",
        fileSize: "3.8 MB",
        downloadCount: 789,
        isPublished: true,
      },
    }),
    prisma.download.create({
      data: {
        title: "Polymer Chemical Compatibility Matrix",
        category: "Datasheets",
        description: "Comprehensive chemical resistance guide for PVC, HDPE, PA66, and XLPE against 200+ industrial acids, oils, and solvents.",
        fileUrl: "/downloads/pdvolts-polymer-chemical-resistance.pdf",
        fileSize: "2.1 MB",
        downloadCount: 412,
        isPublished: true,
      },
    }),
  ]);

  console.log("Seeded Downloads.");

  // 10. Seed Careers
  await Promise.all([
    prisma.career.create({
      data: {
        title: "Senior Polymer Extrusion Process Engineer",
        department: "Manufacturing Operations",
        location: "Houston, TX (Manufacturing Facility)",
        employmentType: "Full-Time",
        experience: "5+ Years in Plastic / Cable Extrusion",
        description: "We are seeking a senior manufacturing engineer to lead continuous line optimization across our tandem wire drawing and high-speed PVC/XLPE extrusion lines.",
        requirements: "B.S. in Chemical Engineering, Materials Science, or Mechanical Engineering. Demonstrated expertise with twin-screw compounding extruders, melt flow index testing, and automated laser diameter gauge calibration.",
        responsibilities: "Optimize extrusion barrel temperature profiles and screw geometry; minimize polymer material scrap rates below 1.2%; oversee tooling die maintenance; implement Lean Manufacturing & SPC controls.",
        salaryInfo: "$95,000 - $125,000 / year + Comprehensive Benefits",
        deadline: "Open until filled",
        isActive: true,
      },
    }),
    prisma.career.create({
      data: {
        title: "Quality Assurance & Testing Specialist",
        department: "Quality Assurance",
        location: "Houston, TX (Onsite Quality Lab)",
        employmentType: "Full-Time",
        experience: "3+ Years in Industrial Electrical Testing",
        description: "Lead daily in-process and final lot release testing across our high-voltage electrical laboratory, conducting spark testing, insulation resistance, and flame propagation tests.",
        requirements: "Associate or Bachelor's degree in Electrical Engineering or Quality Technology. Familiarity with IEC, ASTM, and UL wire test standards. Experience with high-voltage test sets.",
        responsibilities: "Perform high-voltage spark testing and Kelvin bridge conductor resistance measurements; prepare mill test certificates; coordinate ISO internal audits; manage calibration schedules.",
        salaryInfo: "$65,000 - $85,000 / year",
        deadline: "Open until filled",
        isActive: true,
      },
    }),
  ]);

  console.log("Seeded Careers.");

  // 11. Seed Gallery Images
  await Promise.all([
    prisma.galleryImage.create({
      data: {
        title: "High-Speed Tandem Wire Extrusion Line",
        description: "Automated optical diameter feedback controls maintaining ±0.01mm tolerance on insulation jacket thickness.",
        category: "Manufacturing",
        imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
        order: 1,
      },
    }),
    prisma.galleryImage.create({
      data: {
        title: "High-Voltage Testing & Spark Chamber",
        description: "100% in-line spark testing up to 15 kV verifying zero microscopic dielectric pinholes.",
        category: "Quality Lab",
        imageUrl: "https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=800&q=80",
        order: 2,
      },
    }),
    prisma.galleryImage.create({
      data: {
        title: "Precision Injection Molding Facility",
        description: "Hydraulic and all-electric molding cells producing high-temperature nylon electrical components.",
        category: "Manufacturing",
        imageUrl: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80",
        order: 3,
      },
    }),
    prisma.galleryImage.create({
      data: {
        title: "Export Finished Goods Warehouse",
        description: "Temperature-controlled automated high-bay storage with over 2,000 cable drums prepared for international export.",
        category: "Facilities",
        imageUrl: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80",
        order: 4,
      },
    }),
  ]);

  console.log("Seeded Gallery.");

  // 12. Seed Sample Quotes & Inquiries
  const sampleQuote = await prisma.quoteRequest.create({
    data: {
      userId: demoUser.id,
      name: "Marcus Vance",
      company: "Apex Electrical Infrastructure Corp.",
      email: "user@pdvolts.com",
      phone: "+1 (555) 234-5678",
      country: "United States",
      productId: p1.id,
      quantity: "5,000 Meters",
      requirements: "Require 4-core 50 sq.mm armored XLPE with galvanized steel wire armor for underground direct burial at an industrial substation in Ohio. Must include factory batch test certificates.",
      message: "Please include shipping freight quote to Columbus, OH.",
      status: "QUOTED",
      notes: {
        create: [
          {
            authorName: "PdVolts Sales Team",
            content: "Formal commercial estimate #QT-2026-081 sent via email at $14.20/meter. Delivery timeframe 14 business days.",
          },
        ],
      },
    },
  });

  await prisma.enquiry.create({
    data: {
      userId: demoUser.id,
      name: "Marcus Vance",
      company: "Apex Electrical Infrastructure Corp.",
      email: "user@pdvolts.com",
      phone: "+1 (555) 234-5678",
      subject: "Inquiry Regarding Custom Compound Masterbatch Coloring",
      message: "Can your compounding division produce high-visibility safety orange flame-retardant PVC compound with LOI > 32% for external crane hook reeling cable?",
      status: "IN_PROGRESS",
      notes: {
        create: [
          {
            authorName: "Technical Services",
            content: "Forwarded requirement to R&D lab head for formulation evaluation and pigment UV rating.",
          },
        ],
      },
    },
  });

  console.log("Seeded Sample Quotes and Enquiries.");

  // 13. Seed Team Members
  await Promise.all([
    prisma.teamMember.create({
      data: {
        name: "Dr. Arthur Vance",
        position: "Chief Executive Officer & Founder",
        department: "Executive Leadership",
        bio: "Over 35 years in materials science and industrial polymer extrusion. Former technical director for multinational wire consortiums.",
        photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
        order: 1,
      },
    }),
    prisma.teamMember.create({
      data: {
        name: "Sarah Jenkins, P.E.",
        position: "VP of Manufacturing Operations",
        department: "Manufacturing",
        bio: "Specializes in high-capacity continuous wire drawing, tandem extrusion automation, and Lean Six Sigma manufacturing.",
        photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
        order: 2,
      },
    }),
    prisma.teamMember.create({
      data: {
        name: "Vikram Malhotra",
        position: "Head of Polymer R&D & Quality",
        department: "Research & Development",
        bio: "Holds multiple patents in halogen-free flame retardant compounds and cross-linked polyolefin insulation systems.",
        photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
        order: 3,
      },
    }),
  ]);

  console.log("Seeded Team Members.");
  console.log("Database seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error during database seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
