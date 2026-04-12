import csv
import sys

INPUT_FILE = "school_registry.csv"
OUTPUT_FILE = "school_registry_final.csv"
REQUIRED = ["school_code", "school_name", "district", "city"]

# --- Load ---
try:
    with open(INPUT_FILE, newline="", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        raw_rows = list(reader)
        fieldnames = reader.fieldnames or []
except FileNotFoundError:
    print(f"Error: '{INPUT_FILE}' not found. Place it in the same directory as this script.")
    sys.exit(1)

print(f"Loaded {len(raw_rows)} rows, columns: {fieldnames}")

# --- 1. Check required columns ---
missing = [c for c in REQUIRED if c not in fieldnames]
if missing:
    print(f"Error: Missing required columns: {missing}")
    sys.exit(1)

# --- 2. Remove id, keep only required columns, normalise, deduplicate ---
seen_codes = set()
clean_rows = []
duplicates = 0

for row in raw_rows:
    code = row["school_code"].strip().zfill(6)

    if code in seen_codes:
        duplicates += 1
        continue
    seen_codes.add(code)

    clean_rows.append({
        "school_code": code,
        "school_name": row["school_name"].strip(),
        "district":    row["district"].strip(),
        "city":        row["city"].strip(),
    })

if duplicates:
    print(f"Removed {duplicates} duplicate row(s) based on 'school_code'.")
else:
    print("No duplicates found.")

if "id" in fieldnames:
    print("Dropped 'id' column.")

# --- 3. Export ---
with open(OUTPUT_FILE, "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=REQUIRED)
    writer.writeheader()
    writer.writerows(clean_rows)

print(f"\nDone. {len(clean_rows)} rows written to '{OUTPUT_FILE}'.")
