import re
import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path

repo = Path(r"C:\Users\prisc\OneDrive\Dokumente\Clash\F1ClashCompanion_Ultimate")
text = (repo / "script.js").read_text(encoding="utf-8")
block = re.search(r"const driversDb = \[(.*?)\n\];", text, re.S)
code = block.group(1)
app_set = set(re.findall(r"name:\s*'([^']+)'", code))

xlsx = Path(r"C:\Users\prisc\OneDrive\Desktop\Neuer Ordner (2)\Neuer Ordner\Kopie von F1 Clash 2025 Resource Sheet by TR The Flash (22_02_26).xlsx")
z = zipfile.ZipFile(xlsx)
ns = {"x": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}

shared = []
if "xl/sharedStrings.xml" in z.namelist():
    root = ET.fromstring(z.read("xl/sharedStrings.xml"))
    for si in root.findall("x:si", ns):
        shared.append("".join(t.text or "" for t in si.findall(".//x:t", ns)))

sh = ET.fromstring(z.read("xl/worksheets/sheet10.xml"))
sheet = []
for row in sh.findall("x:sheetData/x:row", ns):
    vals = {}
    for c in row.findall("x:c", ns):
        ref = c.attrib.get("r", "")
        col = "".join(ch for ch in ref if ch.isalpha())
        t = c.attrib.get("t")
        v = c.find("x:v", ns)
        if v is None:
            continue
        val = v.text or ""
        if t == "s":
            try:
                val = shared[int(val)]
            except Exception:
                pass
        vals[col] = val
    name = str(vals.get("B", "")).strip()
    if name and name != "Drivers" and re.search(r"[A-Za-z]", name):
        sheet.append(name)

sheet_set = set(sheet)
print("App count", len(app_set), "Sheet unique count", len(sheet_set))
print("Only app:", sorted(app_set - sheet_set))
print("Only sheet:", sorted(sheet_set - app_set))
