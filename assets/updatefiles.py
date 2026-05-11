import os
import json

thisdir = os.path.dirname(os.path.abspath(__file__))
filesdir = os.path.join(thisdir, "files")

files = [
    f for f in os.listdir(filesdir)
    if os.path.isfile(os.path.join(filesdir, f))
]

files.sort(key=lambda x: x.lower())

with open(os.path.join(thisdir, "files.json"), "w", encoding="utf-8") as file:
    json.dump(files, file, indent=2)