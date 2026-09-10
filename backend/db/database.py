import sqlite3
import os
import json

DB_PATH = os.path.join(os.path.dirname(__file__), "bis_standards.db")

INITIAL_STANDARDS = [
    {
        "is_number": "IS 1786:2008",
        "title": "High Strength Deformed Steel Bars and Wires for Concrete Reinforcement",
        "department": "Metallurgical & Civil Engineering",
        "scope": "Covers requirements for thermo-mechanically treated (TMT) deformed steel bars and wires for use as reinforcement in concrete structure.",
        "technical_specifications": "Fe 415, Fe 500, Fe 500D, Fe 550, Fe 550D, Fe 600 grades. Yield stress min 500 N/mm2, Elongation min 16%. Carbon equivalent <= 0.42%.",
        "latest_version": "IS 1786:2008 (Reaffirmed 2019)",
        "status": "Active",
        "amendments": "Amdt 1: 2013 (Mandatory seismic ductility grade Fe 500D), Amdt 3: 2021 (Chemical composition tolerances)",
        "mandatory_certification": "ISI Mark Mandatory",
        "normative_references": ["IS 456:2000", "IS 1608:2005", "IS 1599:2012", "IS 13920:2016"],
        "test_methods": "IS 1608 (Tensile testing), IS 1599 (Bend and re-bend testing), IS 228 (Chemical analysis)",
        "why_not_criteria": "Not suitable for structural steel sections like I-beams (use IS 2062). Not applicable for unreinforced masonry."
    },
    {
        "is_number": "IS 456:2000",
        "title": "Plain and Reinforced Concrete - Code of Practice",
        "department": "Civil Engineering (CED)",
        "scope": "Deals with the general structural use of plain and reinforced concrete in buildings and civil engineering structures.",
        "technical_specifications": "Minimum grade M20 for RCC in moderate exposure, M30 for severe. Maximum water-cement ratio 0.45. Minimum cement content 320 kg/m3.",
        "latest_version": "IS 456:2000 (Reaffirmed 2021)",
        "status": "Active",
        "amendments": "Amdt 1: 2001, Amdt 2: 2005, Amdt 5: 2019 (Self-compacting concrete & SCC testing)",
        "mandatory_certification": "Code of Practice (Mandatory Standard for Government Tenders)",
        "normative_references": ["IS 269:2015", "IS 383:2016", "IS 1786:2008", "IS 10262:2019", "IS 4926:2003"],
        "test_methods": "IS 516 (Compressive strength of concrete), IS 1199 (Sampling and analysis of concrete)",
        "why_not_criteria": "Does not cover prestressed concrete (use IS 1343) or specialized liquid retaining structures (use IS 3370)."
    },
    {
        "is_number": "IS 2062:2011",
        "title": "Hot Rolled Medium and High Tensile Structural Steel",
        "department": "Metallurgical Engineering (MTD)",
        "scope": "Specifies requirements for steel micro-alloyed / structural quality plates, strips, shapes and sections (angles, channels, beams) for welded and bolted construction.",
        "technical_specifications": "Grades E250, E300, E350, E410, E450. Yield strength 250 to 450 MPa. Impact test at -20°C for Grade E250 Z0.",
        "latest_version": "IS 2062:2011 (Reaffirmed 2018)",
        "status": "Active",
        "amendments": "Amdt 1: 2012, Amdt 2: 2015 (Inclusion of sub-qualities BR, B0, C)",
        "mandatory_certification": "ISI Mark Mandatory (Steel & Steel Products Quality Control Order)",
        "normative_references": ["IS 800:2007", "IS 1608:2005", "IS 1852:1985"],
        "test_methods": "IS 1608 (Tensile), IS 1757 (Charpy V-notch impact test), IS 3600 (Weldability)",
        "why_not_criteria": "Not intended for concrete reinforcement bars (use IS 1786). Not suitable for high temperature pressure vessels (use IS 2002)."
    },
    {
        "is_number": "IS 1363 (Part 1):2002",
        "title": "Hexagon Head Bolts, Screws and Nuts of Product Grade C - Part 1 Hexagon Head Bolts",
        "department": "Mechanical Engineering (MED)",
        "scope": "Specifies characteristics of hexagon head bolts with threads from M5 up to M64 and property classes 4.6 and 4.8.",
        "technical_specifications": "Metric thread tolerance 8g, property class 4.6/4.8, surface finish black/galvanized.",
        "latest_version": "IS 1363 (Part 1):2002 (Reaffirmed 2018)",
        "status": "Active",
        "amendments": "Amdt 1: 2008 (Coating thickness standard aligned with ISO 4016)",
        "mandatory_certification": "ISI Mark Mandatory for Fasteners QCO",
        "normative_references": ["IS 1367:2002", "IS 4218:2001"],
        "test_methods": "IS 1367 Part 3 (Mechanical properties & proof load tests)",
        "why_not_criteria": "Grade C is coarse precision. Not for high-fatigue or high-tensile precision engineering (use IS 1364 Grade A/B)."
    },
    {
        "is_number": "IS 4984:2016",
        "title": "High Density Polyethylene (HDPE) Pipes for Water Supply - Specification",
        "department": "Chemical & Plastic Engineering (PCD)",
        "scope": "Covers HDPE pipes suitable for carrying water for potable water supply, industrial effluent disposal, and sewer lines.",
        "technical_specifications": "Material grade PE 63, PE 80, PE 100. Pressure ratings PN 2.5 to PN 16. Density 940-958 kg/m3. MRS 10.0 MPa for PE100.",
        "latest_version": "IS 4984:2016 (Reaffirmed 2021)",
        "status": "Active",
        "amendments": "Amdt 1: 2018 (Inclusion of co-extruded blue layer requirement for drinking water)",
        "mandatory_certification": "ISI Mark Mandatory under BIS Quality Control Order",
        "normative_references": ["IS 7328:1992", "IS 2530:1963", "IS 12235:2004"],
        "test_methods": "IS 12235 Part 1 (Internal hydrostatic pressure test), IS 12235 Part 3 (Melt Flow Index test)",
        "why_not_criteria": "Not rated for hot water supply above 45°C (use CPVC IS 15778). Not for high pressure gas transmission without gas rating."
    },
    {
        "is_number": "IS 10262:2019",
        "title": "Concrete Mix Proportioning - Guidelines",
        "department": "Civil Engineering (CED)",
        "scope": "Provides guidelines for proportioning concrete mixes (standard concrete, high strength concrete, self-compacting concrete, mass concrete).",
        "technical_specifications": "High strength concrete up to M80. Concrete with fly ash, GGBS, silica fume, chemical admixtures.",
        "latest_version": "IS 10262:2019",
        "status": "Active",
        "amendments": "Amdt 1: 2020 (Clarification on water-reducing superplasticizer dosage and slump retention)",
        "mandatory_certification": "Guidelines Standard (Normative to IS 456)",
        "normative_references": ["IS 456:2000", "IS 383:2016", "IS 9103:1999", "IS 3812:2013"],
        "test_methods": "IS 1199 (Slump test, V-Funnel test for SCC), IS 516 (28-day cube strength testing)",
        "why_not_criteria": "Does not apply directly to asphalt/bituminous concrete mix design (use IRC:37 / IRC:SP:84)."
    },
    {
        "is_number": "IS 13920:2016",
        "title": "Ductile Design and Detailing of Reinforced Concrete Structures Subjected to Seismic Forces",
        "department": "Civil Engineering (CED)",
        "scope": "Specifies requirements for design and detailing of monolithic reinforced concrete building structures in seismic zones III, IV, and V.",
        "technical_specifications": "Minimum grade M20 concrete, mandatory use of Fe 500D or Fe 550D TMT bars. Special confining hoop spacing <= 100mm.",
        "latest_version": "IS 13920:2016 (Reaffirmed 2021)",
        "status": "Active",
        "amendments": "Amdt 1: 2017 (Inclusion of shear wall boundary element confinement rules)",
        "mandatory_certification": "Mandatory National Building Code (NBC 2016) Compliance",
        "normative_references": ["IS 456:2000", "IS 1893 (Part 1):2016", "IS 1786:2008"],
        "test_methods": "Cyclic load testing & non-destructive seismic response measurement",
        "why_not_criteria": "Not required for Seismic Zone II low-rise structures unless specifically mandated by regional development authority."
    },
    {
        "is_number": "IS 13252 (Part 1):2010",
        "title": "Information Technology Equipment - Safety - General Requirements",
        "department": "Electronics & IT Department (LITD)",
        "scope": "Applicable to mains-powered or battery-powered information technology equipment including electrical business equipment, routers, servers, laptops, and LED displays.",
        "technical_specifications": "Insulation resistance > 2 MOhm, leakage current < 0.75mA, flame retardant casing UL94 V-0 or V-1.",
        "latest_version": "IS 13252 (Part 1):2010 / IEC 60950-1:2005",
        "status": "Active (Transitioning to IS 61326 / IS 16333)",
        "amendments": "Amdt 2: 2015 (Mandatory registration under MeitY CRS scheme)",
        "mandatory_certification": "Compulsory Registration Scheme (MeitY CRS)",
        "normative_references": ["IS 61000-4-2", "IS 16333 (Part 3):2017"],
        "test_methods": "IS 13252 dielectric strength test, thermal endurance test, fault condition analysis",
        "why_not_criteria": "Does not cover medical electrical equipment (use IS 13450 / IEC 60601) or household appliances (use IS 302)."
    },
    {
        "is_number": "IS 14543:2016",
        "title": "Packaged Drinking Water (Other than Packaged Natural Mineral Water) - Specification",
        "department": "Food & Agriculture Department (FAD) & FSSAI",
        "scope": "Prescribes requirements and methods of sampling and test for packaged drinking water intended for human consumption.",
        "technical_specifications": "TDS 50-500 mg/l, pH 6.5-8.5, Turbidity < 1 NTU. Total coliform Nil/250ml. Mandatory ozonated or UV treated bottle filling.",
        "latest_version": "IS 14543:2016",
        "status": "Active",
        "amendments": "Amdt 1: 2018, Amdt 3: 2021 (Microbiological parameter limits and pesticide residue < 0.0001 mg/l)",
        "mandatory_certification": "ISI Mark + FSSAI Dual Mandatory Certification",
        "normative_references": ["IS 3025:2019", "IS 10500:2012", "FSSAI Reg 2.10.8"],
        "test_methods": "IS 3025 Part 43 (Heavy metals AAS testing), IS 1622 (Microbiological analysis)",
        "why_not_criteria": "Does not apply to Packaged Natural Mineral Water sourced from mountain springs (use IS 13428)."
    },
    {
        "is_number": "IS 10500:2012",
        "title": "Drinking Water Specifications",
        "department": "Food & Chemical Department (FAD/PCD)",
        "scope": "Prescribes requirements for water intended for human consumption, domestic purposes, and municipal distribution.",
        "technical_specifications": "Total Dissolved Solids (TDS) acceptable limit 500 mg/l (permissible 2000 mg/l in absence of alternate source). Hardness 200 mg/l. Iron < 0.3 mg/l.",
        "latest_version": "IS 10500:2012 (Reaffirmed 2018)",
        "status": "Active",
        "amendments": "Amdt 2: 2018 (Inclusion of Viable Bacteria, Cyanotoxin and Microcystin standards)",
        "mandatory_certification": "Mandatory Standard for Municipal Water Supplies & Water Treatment Plants",
        "normative_references": ["IS 3025:2019", "IS 1622:1981"],
        "test_methods": "IS 3025 methods for physical, chemical, and radiological properties",
        "why_not_criteria": "Not for industrial boiler feed water or pharmaceutical Grade WFI water (use IS 1070)."
    },
    {
        "is_number": "IS 12345:2024",
        "title": "AI & Smart System Integration for Public Procurement and BIS Compliance",
        "department": "Electronics & Information Technology (LITD)",
        "scope": "Standardizes metadata schemas, security protocols, API specifications, and explainable AI metrics for public sector software.",
        "technical_specifications": "JSON-LD compliance, SHA-256 integrity check, OAuth 2.0 security framework, RAG grounding precision score > 0.85.",
        "latest_version": "IS 12345:2024",
        "status": "Active (Latest Version)",
        "amendments": "Amdt 1: 2024 (Integration of Knowledge Graph Schema)",
        "mandatory_certification": "Mandatory for Government AI Software Procurements",
        "normative_references": ["IS 13252:2010", "IS 27001:2013"],
        "test_methods": "ISO 25010 Software Quality Testing & NIST Explainable AI Evaluation",
        "why_not_criteria": "Not applicable for standalone hardware devices without software processing interface."
    }
]

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS bis_standards (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        is_number TEXT UNIQUE NOT NULL,
        title TEXT NOT NULL,
        department TEXT NOT NULL,
        scope TEXT NOT NULL,
        technical_specifications TEXT NOT NULL,
        latest_version TEXT NOT NULL,
        status TEXT NOT NULL,
        amendments TEXT NOT NULL,
        mandatory_certification TEXT NOT NULL,
        normative_references TEXT NOT NULL,
        test_methods TEXT NOT NULL,
        why_not_criteria TEXT NOT NULL
    )
    ''')
    
    # Check if empty, populate
    cursor.execute("SELECT COUNT(*) FROM bis_standards")
    if cursor.fetchone()[0] == 0:
        for std in INITIAL_STANDARDS:
            cursor.execute('''
            INSERT INTO bis_standards (
                is_number, title, department, scope, technical_specifications,
                latest_version, status, amendments, mandatory_certification,
                normative_references, test_methods, why_not_criteria
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                std["is_number"],
                std["title"],
                std["department"],
                std["scope"],
                std["technical_specifications"],
                std["latest_version"],
                std["status"],
                std["amendments"],
                std["mandatory_certification"],
                json.dumps(std["normative_references"]),
                std["test_methods"],
                std["why_not_criteria"]
            ))
        conn.commit()
    conn.close()

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def get_all_standards():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM bis_standards")
    rows = cursor.fetchall()
    result = []
    for row in rows:
        item = dict(row)
        item["normative_references"] = json.loads(item["normative_references"])
        result.append(item)
    conn.close()
    return result

if __name__ == "__main__":
    init_db()
    print(f"Database initialized at {DB_PATH} with {len(get_all_standards())} standards.")
