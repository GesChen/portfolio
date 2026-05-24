import os
import json

thisdir = os.path.dirname(os.path.abspath(__file__))
filesdir = os.path.join(thisdir, "files")

files = [
    f for f in os.listdir(filesdir)
    if os.path.isfile(os.path.join(filesdir, f))
]

files.sort(key=lambda x: x.lower())

with open('folders.json', 'r') as f:
    existing = json.load(f)

notinexisting = [f for f in files 
                 if not any(f in existing[fold] for fold in existing.keys())]

existing['unsorted'].extend(notinexisting)

existing['all'] = files

with open('folders.json', 'w') as f:
    json.dump(existing, f, indent=2)