import type { User, Asset, Allocation } from "./types"

export interface BaseAllocation {
  id: string
  empId: string
  empName: string
  businessArea: string
  allocationDate: string
  status: 'active' | 'returned' | 'pending' | 'approved'
  remarks?: string
}

export interface LaptopAllocation extends BaseAllocation {
  category: 'laptop'
  laptopSrNo: string
  laptopOwnership: 'company' | 'employee' | 'leased'
  makeModel: string
  configuration: string
  charger: 'yes' | 'no'
  bag: 'yes' | 'no'
  headphoneSrNo?: string
  mouseSrNo?: string
  keyboardSrNo?: string
  dockStationSrNo?: string
  macConnectHardware?: string
}

export interface MobileAllocation extends BaseAllocation {
  category: 'mobile'
  mobileSrNo: string
  imeiNo: string
  makeModel: string
  charger: 'yes' | 'no'
  chargerSrNo?: string
  backCover: 'yes' | 'no'
  simCard: 'yes' | 'no'
  simNumber?: string
}

export interface MonitorAllocation extends BaseAllocation {
  category: 'monitor'
  monitorSrNo: string
  makeModel: string
  powerCable: 'yes' | 'no'
  hdmi: 'yes' | 'no'
}

export interface AccessoriesAllocation extends BaseAllocation {
  category: 'accessories'
  accessories: {
    id: string
    accessoryType: string
    accessorySrNo: string
    makeModel: string
    condition: 'New' | 'Like New' | 'Good' | 'Fair' | 'Poor'
    quantity: string
  }[]
}

export const mockUsers: User[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@company.com",
    password: "admin123",
    role: "admin",
    designation: "IT Administrator",
    department: "IT",
    profileImage: "/admin-profile.png",
    employeeId: "ADM001",
  },
  {
    id: "2",
    name: "John Doe",
    email: "john@company.com",
    password: "john123",
    role: "employee",
    designation: "Software Engineer",
    department: "Engineering",
    profileImage: "/employee-profile.jpg",
    employeeId: "EMP001",
  },
  {
    id: "3",
    name: "Jane Smith",
    email: "jane@company.com",
    password: "jane123",
    role: "employee",
    designation: "Product Manager",
    department: "Product",
    profileImage: "/employee-profile.jpg",
    employeeId: "EMP002",
  },
  {
    id: "4",
    name: "Robert Johnson",
    email: "robert@company.com",
    password: "robert123",
    role: "employee",
    designation: "UX Designer",
    department: "Design",
    profileImage: "/employee-profile.jpg",
    employeeId: "EMP003",
  },
  {
    id: "5",
    name: "Sarah Williams",
    email: "sarah@company.com",
    password: "sarah123",
    role: "employee",
    designation: "Data Analyst",
    department: "Analytics",
    profileImage: "/employee-profile.jpg",
    employeeId: "EMP004",
  },
  {
    id: "6",
    name: "Michael Brown",
    email: "michael@company.com",
    password: "michael123",
    role: "employee",
    designation: "DevOps Engineer",
    department: "Operations",
    profileImage: "/employee-profile.jpg",
    employeeId: "EMP005",
  },
]

export const mockAssets: Asset[] = [
  // Laptops (Computers)
  {
    id: "1",
    assetId: "ASSET001",
    name: "Dell Laptop",
    category: "Computers",
    model: "XPS 13",
    configuration: "i7, 16GB RAM, 512GB SSD",
    serialNumber: "DLXPS13-001",
    imeiNumber: "357890123456789",
    purchaseDate: "2023-01-15",
    warrantyExpiry: "2026-01-15",
    status: "available",
    allocationType: "Company Owned",
    ownership: "company",
  },
  {
    id: "2",
    assetId: "ASSET002",
    name: "Apple MacBook",
    category: "Computers",
    model: 'MacBook Pro 14"',
    configuration: "M2, 16GB RAM, 256GB SSD",
    serialNumber: "MBP14-001",
    imeiNumber: "357890123456790",
    purchaseDate: "2023-03-10",
    warrantyExpiry: "2026-03-10",
    status: "available",
    allocationType: "Company Owned",
    ownership: "company",
  },
  {
    id: "3",
    assetId: "ASSET003",
    name: "Lenovo ThinkPad",
    category: "Computers",
    model: "X1 Carbon",
    configuration: "i5, 8GB RAM, 256GB SSD",
    serialNumber: "LNTKP-001",
    imeiNumber: "357890123456791",
    purchaseDate: "2023-05-20",
    warrantyExpiry: "2026-05-20",
    status: "available",
    allocationType: "Employee Owned",
    ownership: "employee",
  },
  {
    id: "4",
    assetId: "ASSET004",
    name: "HP EliteBook",
    category: "Computers",
    model: "840 G9",
    configuration: "i7, 32GB RAM, 1TB SSD",
    serialNumber: "HPELB-001",
    imeiNumber: "357890123456792",
    purchaseDate: "2023-07-12",
    warrantyExpiry: "2026-07-12",
    status: "available",
    allocationType: "Company Owned",
    ownership: "company",
  },
  
  // Mobile Devices
  {
    id: "5",
    assetId: "ASSET005",
    name: "iPhone",
    category: "Mobile",
    model: "14 Pro",
    configuration: "256GB, Space Black",
    serialNumber: "IPH14-001",
    imeiNumber: "356789012345678",
    purchaseDate: "2023-06-01",
    warrantyExpiry: "2025-06-01",
    status: "available",
    allocationType: "Company Owned",
    ownership: "company",
  },
  {
    id: "6",
    assetId: "ASSET006",
    name: "Samsung Galaxy",
    category: "Mobile",
    model: "S23 Ultra",
    configuration: "512GB, Phantom Black",
    serialNumber: "SGS23-001",
    imeiNumber: "357890123456123",
    purchaseDate: "2023-08-15",
    warrantyExpiry: "2025-08-15",
    status: "available",
    allocationType: "Company Owned",
    ownership: "company",
  },
  {
    id: "7",
    assetId: "ASSET007",
    name: "Google Pixel",
    category: "Mobile",
    model: "7 Pro",
    configuration: "128GB, Snow",
    serialNumber: "GPXL7-001",
    imeiNumber: "356789054321098",
    purchaseDate: "2023-09-10",
    warrantyExpiry: "2025-09-10",
    status: "available",
    allocationType: "Company Owned",
    ownership: "company",
  },
  {
    id: "8",
    assetId: "ASSET008",
    name: "OnePlus",
    category: "Mobile",
    model: "11 5G",
    configuration: "256GB, Titan Black",
    serialNumber: "OP11-001",
    imeiNumber: "357890165432109",
    purchaseDate: "2023-10-05",
    warrantyExpiry: "2025-10-05",
    status: "available",
    allocationType: "Company Owned",
    ownership: "company",
  },
  
  // Monitors
  {
    id: "9",
    assetId: "ASSET009",
    name: "Dell Monitor",
    category: "Monitor",
    model: '27" UltraSharp',
    configuration: "4K, USB-C, Height Adjustable",
    serialNumber: "DLMON-001",
    purchaseDate: "2023-02-20",
    warrantyExpiry: "2026-02-20",
    status: "available",
    allocationType: "Company Owned",
    ownership: "company",
  },
  {
    id: "10",
    assetId: "ASSET010",
    name: "LG Monitor",
    category: "Monitor",
    model: '34" UltraWide',
    configuration: "3440x1440, 144Hz, Curved",
    serialNumber: "LGMON-001",
    purchaseDate: "2023-04-15",
    warrantyExpiry: "2026-04-15",
    status: "available",
    allocationType: "Company Owned",
    ownership: "company",
  },
  {
    id: "11",
    assetId: "ASSET011",
    name: "Samsung Monitor",
    category: "Monitor",
    model: '32" Odyssey',
    configuration: "4K, 165Hz, Quantum HDR",
    serialNumber: "SGMON-001",
    purchaseDate: "2023-07-30",
    warrantyExpiry: "2026-07-30",
    status: "available",
    allocationType: "Company Owned",
    ownership: "company",
  },
  {
    id: "12",
    assetId: "ASSET012",
    name: "ASUS Monitor",
    category: "Monitor",
    model: '24" ProArt',
    configuration: "1080p, Color Accurate",
    serialNumber: "ASMON-001",
    purchaseDate: "2023-11-10",
    warrantyExpiry: "2026-11-10",
    status: "available",
    allocationType: "Company Owned",
    ownership: "company",
  },
  
  // Accessories
  {
    id: "13",
    assetId: "ASSET013",
    name: "Sony Headphones",
    category: "Headphone",
    model: "WH-1000XM5",
    configuration: "Noise Cancelling, Wireless",
    serialNumber: "SNYHP-001",
    purchaseDate: "2023-03-05",
    warrantyExpiry: "2025-03-05",
    status: "available",
    allocationType: "Company Owned",
    ownership: "company",
  },
  {
    id: "14",
    assetId: "ASSET014",
    name: "Bose Headphones",
    category: "Headphone",
    model: "QuietComfort 45",
    configuration: "Noise Cancelling, Bluetooth",
    serialNumber: "BOSHP-001",
    purchaseDate: "2023-05-12",
    warrantyExpiry: "2025-05-12",
    status: "available",
    allocationType: "Company Owned",
    ownership: "company",
  },
  {
    id: "15",
    assetId: "ASSET015",
    name: "Logitech Mouse",
    category: "Mouse",
    model: "MX Master 3S",
    configuration: "Wireless, Ergonomic",
    serialNumber: "LGTMS-001",
    purchaseDate: "2023-04-10",
    warrantyExpiry: "2025-04-10",
    status: "available",
    allocationType: "Company Owned",
    ownership: "company",
  },
  {
    id: "16",
    assetId: "ASSET016",
    name: "Razer Mouse",
    category: "Mouse",
    model: "DeathAdder V3",
    configuration: "Wired, 30K DPI",
    serialNumber: "RZRMS-001",
    purchaseDate: "2023-06-20",
    warrantyExpiry: "2025-06-20",
    status: "available",
    allocationType: "Company Owned",
    ownership: "company",
  },
  {
    id: "17",
    assetId: "ASSET017",
    name: "Logitech Keyboard",
    category: "Keyboard",
    model: "MX Keys S",
    configuration: "Wireless, Backlit",
    serialNumber: "LGTKB-001",
    purchaseDate: "2023-03-15",
    warrantyExpiry: "2025-03-15",
    status: "available",
    allocationType: "Company Owned",
    ownership: "company",
  },
  {
    id: "18",
    assetId: "ASSET018",
    name: "Keychron Keyboard",
    category: "Keyboard",
    model: "K8 Pro",
    configuration: "Mechanical, Wireless",
    serialNumber: "KCHKB-001",
    purchaseDate: "2023-08-05",
    warrantyExpiry: "2025-08-05",
    status: "available",
    allocationType: "Company Owned",
    ownership: "company",
  },
  {
    id: "19",
    assetId: "ASSET019",
    name: "Dell Dock Station",
    category: "Dock-station",
    model: "WD19TBS",
    configuration: "Thunderbolt 3, 180W",
    serialNumber: "DLDKS-001",
    purchaseDate: "2023-02-25",
    warrantyExpiry: "2026-02-25",
    status: "available",
    allocationType: "Company Owned",
    ownership: "company",
  },
  {
    id: "20",
    assetId: "ASSET020",
    name: "Caldigit Dock",
    category: "Dock-station",
    model: "TS4",
    configuration: "Thunderbolt 4, 98W",
    serialNumber: "CALDK-001",
    purchaseDate: "2023-09-18",
    warrantyExpiry: "2026-09-18",
    status: "available",
    allocationType: "Company Owned",
    ownership: "company",
  },
  {
    id: "21",
    assetId: "ASSET021",
    name: "Apple Mac Connector",
    category: "Mac-Connector",
    model: "USB-C to HDMI",
    configuration: "4K @ 60Hz",
    serialNumber: "APLMC-001",
    purchaseDate: "2023-01-30",
    warrantyExpiry: "2026-01-30",
    status: "available",
    allocationType: "Company Owned",
    ownership: "company",
  },
  {
    id: "22",
    assetId: "ASSET022",
    name: "Anker Mac Connector",
    category: "Mac-Connector",
    model: "7-in-1 Hub",
    configuration: "HDMI, USB, Ethernet",
    serialNumber: "ANKMC-001",
    purchaseDate: "2023-05-25",
    warrantyExpiry: "2026-05-25",
    status: "available",
    allocationType: "Company Owned",
    ownership: "company",
  },
  // Additional accessory types
  {
    id: "23",
    assetId: "ASSET023",
    name: "Laptop Charger",
    category: "Charger",
    model: "65W Type-C",
    configuration: "Universal, Fast Charging",
    serialNumber: "CHG-LPT001",
    purchaseDate: "2023-02-10",
    warrantyExpiry: "2025-02-10",
    status: "available",
    allocationType: "Company Owned",
    ownership: "company",
  },
  {
    id: "24",
    assetId: "ASSET024",
    name: "Laptop Bag",
    category: "Bag",
    model: "Professional Backpack",
    configuration: "Water Resistant, 15.6 inch",
    serialNumber: "BAG-LPT001",
    purchaseDate: "2023-03-15",
    warrantyExpiry: "2025-03-15",
    status: "available",
    allocationType: "Company Owned",
    ownership: "company",
  },
  {
    id: "25",
    assetId: "ASSET025",
    name: "HDMI Cable",
    category: "Cable",
    model: "High Speed",
    configuration: "2m, 4K@60Hz",
    serialNumber: "CBL-HDMI001",
    purchaseDate: "2023-04-20",
    warrantyExpiry: "2026-04-20",
    status: "available",
    allocationType: "Company Owned",
    ownership: "company",
  },
  {
    id: "26",
    assetId: "ASSET026",
    name: "USB-C Adapter",
    category: "Adapter",
    model: "Multi-port",
    configuration: "HDMI, USB, Ethernet",
    serialNumber: "ADP-USBC001",
    purchaseDate: "2023-05-25",
    warrantyExpiry: "2026-05-25",
    status: "available",
    allocationType: "Company Owned",
    ownership: "company",
  },
  {
    id: "27",
    assetId: "ASSET027",
    name: "Monitor Stand",
    category: "Stand",
    model: "Adjustable",
    configuration: "Height adjustable, VESA compatible",
    serialNumber: "STD-MON001",
    purchaseDate: "2023-06-30",
    warrantyExpiry: "2026-06-30",
    status: "available",
    allocationType: "Company Owned",
    ownership: "company",
  },
  {
    id: "28",
    assetId: "ASSET028",
    name: "Phone Case",
    category: "Case",
    model: "Protective",
    configuration: "Shock absorbent, Clear",
    serialNumber: "CAS-PHN001",
    purchaseDate: "2023-07-05",
    warrantyExpiry: "2025-07-05",
    status: "available",
    allocationType: "Company Owned",
    ownership: "company",
  },
  {
    id: "29",
    assetId: "ASSET029",
    name: "Screen Protector",
    category: "Screen Protector",
    model: "Tempered Glass",
    configuration: "9H hardness, Anti-glare",
    serialNumber: "PRO-SCR001",
    purchaseDate: "2023-08-10",
    warrantyExpiry: "2025-08-10",
    status: "available",
    allocationType: "Company Owned",
    ownership: "company",
  },
  
  // Previously allocated assets (for testing)
  {
    id: "30",
    assetId: "ASSET030",
    name: "Dell Laptop",
    category: "Computers",
    model: "Latitude 5430",
    configuration: "i5, 16GB RAM, 512GB SSD",
    serialNumber: "DLLAT-001",
    imeiNumber: "357890123456793",
    purchaseDate: "2023-02-01",
    warrantyExpiry: "2026-02-01",
    status: "allocated",
    allocatedTo: "EMP001",
    allocationDate: "2023-02-01",
    allocationType: "Permanent",
    ownership: "company",
  },
  {
    id: "31",
    assetId: "ASSET031",
    name: "HP Monitor",
    category: "Monitor",
    model: '24" EliteDisplay',
    configuration: "1080p, 75Hz",
    serialNumber: "HPMON-001",
    purchaseDate: "2023-02-20",
    warrantyExpiry: "2025-02-20",
    status: "under_repair",
    ownership: "company",
  },
  {
    id: "32",
    assetId: "ASSET032",
    name: "iPhone 13",
    category: "Mobile",
    model: "13 Pro",
    configuration: "128GB, Sierra Blue",
    serialNumber: "IPH13-001",
    imeiNumber: "356789012345679",
    purchaseDate: "2022-11-15",
    warrantyExpiry: "2024-11-15",
    status: "returned",
    ownership: "company",
  },
]

// Legacy allocations (keep for compatibility)
export const mockAllocations: Allocation[] = [
  {
    id: "1",
    assetId: "30",
    employeeId: "EMP001",
    allocationDate: "2023-02-01",
    allocationType: "Permanent",
    remarks: "Development laptop for new project",
    status: "approved",
    acknowledgmentDate: "2023-02-02",
  },
  {
    id: "2",
    assetId: "31",
    employeeId: "EMP002",
    allocationDate: "2023-04-01",
    allocationType: "Temporary",
    remarks: "Temporary monitor while main one is being repaired",
    status: "pending",
  },
  {
    id: "3",
    assetId: "14",
    employeeId: "EMP003",
    allocationDate: "2023-06-15",
    allocationType: "Permanent",
    remarks: "Noise cancelling headphones for design work",
    status: "approved",
    acknowledgmentDate: "2023-06-16",
  },
  {
    id: "4",
    assetId: "16",
    employeeId: "EMP004",
    allocationDate: "2023-07-20",
    allocationType: "Permanent",
    remarks: "Gaming mouse for data visualization work",
    status: "approved",
    acknowledgmentDate: "2023-07-21",
  },
  {
    id: "5",
    assetId: "19",
    employeeId: "EMP005",
    allocationDate: "2023-08-10",
    allocationType: "Loan",
    remarks: "Temporary dock station for testing",
    status: "pending",
  },
]

// New allocation data types
export const mockLaptopAllocations: LaptopAllocation[] = [
  {
    id: "LAP001",
    empId: "EMP001",
    empName: "John Doe",
    businessArea: "Engineering",
    laptopSrNo: "DLXPS13-001",
    laptopOwnership: "company",
    makeModel: "Dell XPS 13",
    configuration: "i7, 16GB RAM, 512GB SSD",
    charger: "yes",
    bag: "yes",
    headphoneSrNo: "SNYHP-001",
    mouseSrNo: "LGTMS-001",
    keyboardSrNo: "LGTKB-001",
    allocationDate: "2024-01-15",
    status: "active",
    remarks: "Primary development machine",
    category: "laptop"
  },
  {
    id: "LAP002",
    empId: "EMP002",
    empName: "Jane Smith",
    businessArea: "Product Management",
    laptopSrNo: "MBP14-001",
    laptopOwnership: "company",
    makeModel: "Apple MacBook Pro 14\"",
    configuration: "M2, 16GB RAM, 256GB SSD",
    charger: "yes",
    bag: "no",
    dockStationSrNo: "DLDKS-001",
    macConnectHardware: "APLMC-001",
    allocationDate: "2024-01-10",
    status: "active",
    remarks: "Product design and prototyping",
    category: "laptop"
  },
  {
    id: "LAP003",
    empId: "EMP003",
    empName: "Robert Johnson",
    businessArea: "Design",
    laptopSrNo: "LNTKP-001",
    laptopOwnership: "employee",
    makeModel: "Lenovo ThinkPad X1 Carbon",
    configuration: "i5, 8GB RAM, 256GB SSD",
    charger: "yes",
    bag: "yes",
    allocationDate: "2024-01-05",
    status: "returned",
    remarks: "Employee-owned laptop for UI/UX work",
    category: "laptop"
  }
]

export const mockMobileAllocations: MobileAllocation[] = [
  {
    id: "MOB001",
    empId: "EMP002",
    empName: "Jane Smith",
    businessArea: "Product Management",
    mobileSrNo: "IPH14-001",
    imeiNo: "356789012345678",
    makeModel: "iPhone 14 Pro",
    charger: "yes",
    chargerSrNo: "CHG-IPH001",
    backCover: "yes",
    simCard: "yes",
    simNumber: "+12345678901",
    allocationDate: "2024-01-12",
    status: "active",
    remarks: "Company mobile for client communications",
    category: "mobile"
  },
  {
    id: "MOB002",
    empId: "EMP004",
    empName: "Sarah Williams",
    businessArea: "Sales",
    mobileSrNo: "SGS23-001",
    imeiNo: "357890123456123",
    makeModel: "Samsung Galaxy S23 Ultra",
    charger: "yes",
    chargerSrNo: "CHG-SAM001",
    backCover: "no",
    simCard: "yes",
    simNumber: "+12345678902",
    allocationDate: "2024-01-08",
    status: "active",
    remarks: "Field sales device",
    category: "mobile"
  },
  {
    id: "MOB003",
    empId: "EMP005",
    empName: "Michael Brown",
    businessArea: "Operations",
    mobileSrNo: "GPXL7-001",
    imeiNo: "356789054321098",
    makeModel: "Google Pixel 7 Pro",
    charger: "no",
    backCover: "yes",
    simCard: "no",
    allocationDate: "2024-01-03",
    status: "pending",
    remarks: "Testing device for mobile app development",
    category: "mobile"
  }
]

export const mockMonitorAllocations: MonitorAllocation[] = [
  {
    id: "MON001",
    empId: "EMP001",
    empName: "John Doe",
    businessArea: "Engineering",
    monitorSrNo: "DLMON-001",
    makeModel: "Dell 27\" UltraSharp",
    powerCable: "yes",
    hdmi: "yes",
    allocationDate: "2024-01-14",
    status: "active",
    remarks: "Primary monitor for development work",
    category: "monitor"
  },
  {
    id: "MON002",
    empId: "EMP002",
    empName: "Jane Smith",
    businessArea: "Product Management",
    monitorSrNo: "LGMON-001",
    makeModel: "LG 34\" UltraWide",
    powerCable: "yes",
    hdmi: "yes",
    allocationDate: "2024-01-09",
    status: "active",
    remarks: "Wide monitor for product roadmapping",
    category: "monitor"
  },
  {
    id: "MON003",
    empId: "EMP003",
    empName: "Robert Johnson",
    businessArea: "Design",
    monitorSrNo: "SGMON-001",
    makeModel: "Samsung 32\" Odyssey",
    powerCable: "yes",
    hdmi: "no",
    allocationDate: "2024-01-04",
    status: "returned",
    remarks: "Color-accurate monitor for design work",
    category: "monitor"
  }
]

export const mockAccessoriesAllocations: AccessoriesAllocation[] = [
  {
    id: "ACC001",
    empId: "EMP001",
    empName: "John Doe",
    businessArea: "Engineering",
    accessories: [
      {
        id: "1",
        accessoryType: "Headphone",
        accessorySrNo: "SNYHP-001",
        makeModel: "Sony WH-1000XM5",
        condition: "New",
        quantity: "1"
      },
      {
        id: "2",
        accessoryType: "Mouse",
        accessorySrNo: "LGTMS-001",
        makeModel: "Logitech MX Master 3S",
        condition: "New",
        quantity: "1"
      },
      {
        id: "3",
        accessoryType: "Keyboard",
        accessorySrNo: "LGTKB-001",
        makeModel: "Logitech MX Keys S",
        condition: "New",
        quantity: "1"
      }
    ],
    allocationDate: "2024-01-16",
    status: "active",
    remarks: "Complete accessory setup for workstation",
    category: "accessories"
  },
  {
    id: "ACC002",
    empId: "EMP002",
    empName: "Jane Smith",
    businessArea: "Product Management",
    accessories: [
      {
        id: "4",
        accessoryType: "Dock-station",
        accessorySrNo: "DLDKS-001",
        makeModel: "Dell WD19TBS",
        condition: "Like New",
        quantity: "1"
      },
      {
        id: "5",
        accessoryType: "Mac-Connector",
        accessorySrNo: "APLMC-001",
        makeModel: "Apple USB-C to HDMI",
        condition: "Good",
        quantity: "1"
      },
      {
        id: "6",
        accessoryType: "Charger",
        accessorySrNo: "CHG-LPT001",
        makeModel: "65W Type-C",
        condition: "New",
        quantity: "1"
      }
    ],
    allocationDate: "2024-01-11",
    status: "active",
    remarks: "Docking and connectivity accessories for MacBook",
    category: "accessories"
  },
  {
    id: "ACC003",
    empId: "EMP004",
    empName: "Sarah Williams",
    businessArea: "Sales",
    accessories: [
      {
        id: "7",
        accessoryType: "Bag",
        accessorySrNo: "BAG-LPT001",
        makeModel: "Professional Backpack",
        condition: "New",
        quantity: "1"
      },
      {
        id: "8",
        accessoryType: "Case",
        accessorySrNo: "CAS-PHN001",
        makeModel: "Protective Phone Case",
        condition: "New",
        quantity: "1"
      },
      {
        id: "9",
        accessoryType: "Screen Protector",
        accessorySrNo: "PRO-SCR001",
        makeModel: "Tempered Glass",
        condition: "New",
        quantity: "1"
      }
    ],
    allocationDate: "2024-01-06",
    status: "returned",
    remarks: "Field accessories for sales representative",
    category: "accessories"
  }
]

export const mockEmployees: User[] = [
  {
    id: "2",
    name: "John Doe",
    email: "john@company.com",
    role: "employee",
    designation: "Software Engineer",
    department: "Engineering",
    profileImage: "/diverse-office-employee.png",
    employeeId: "EMP001",
  },
  {
    id: "3",
    name: "Jane Smith",
    email: "jane@company.com",
    role: "employee",
    designation: "Product Manager",
    department: "Product",
    profileImage: "/diverse-office-employee.png",
    employeeId: "EMP002",
  },
  {
    id: "4",
    name: "Robert Johnson",
    email: "robert@company.com",
    role: "employee",
    designation: "UX Designer",
    department: "Design",
    profileImage: "/diverse-office-employee.png",
    employeeId: "EMP003",
  },
  {
    id: "5",
    name: "Sarah Williams",
    email: "sarah@company.com",
    role: "employee",
    designation: "Data Analyst",
    department: "Analytics",
    profileImage: "/diverse-office-employee.png",
    employeeId: "EMP004",
  },
  {
    id: "6",
    name: "Michael Brown",
    email: "michael@company.com",
    role: "employee",
    designation: "DevOps Engineer",
    department: "Operations",
    profileImage: "/diverse-office-employee.png",
    employeeId: "EMP005",
  },
]