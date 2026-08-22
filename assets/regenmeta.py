import json
from pathlib import Path

this_dir = Path(__file__).resolve().parent
files_dir = this_dir / "files"
metadata_path = this_dir / "metadata.json"
backup_path = this_dir / "metadata.json.backup"

files = sorted(
    (path.name for path in files_dir.iterdir() if path.is_file()),
    key=str.casefold,
)

with metadata_path.open("r", encoding="utf-8") as current_file:
    current_metadata = json.load(current_file)

fields = ["description"]

data = {}

for filename in files:
    description = current_metadata.get(filename)

    if not isinstance(description, dict):
        description = {}

    data[filename] = {
        field: description.get(field, "")
        for field in fields
    }

# Back up the existing metadata.
with backup_path.open("w", encoding="utf-8", newline="\n") as backup_file:
    json.dump(
        current_metadata,
        backup_file,
        indent=2,
        ensure_ascii=False,
    )
    backup_file.write("\n")

# Write updated metadata while preserving Unicode characters such as emojis.
with metadata_path.open("w", encoding="utf-8", newline="\n") as metadata_file:
    json.dump(
        data,
        metadata_file,
        indent=2,
        ensure_ascii=False,
    )
    metadata_file.write("\n")
