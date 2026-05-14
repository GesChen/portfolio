import os
import json

thisdir = os.path.dirname(os.path.abspath(__file__))
filesdir = os.path.join(thisdir, "files")

files = [
    f for f in os.listdir(filesdir)
    if os.path.isfile(os.path.join(filesdir, f))
]

files.sort(key=lambda x: x.lower())

with open(os.path.join(thisdir, "metadata.json"), 'r') as cur:
    curdesc = json.load(cur)

# fill in with current data
data = {
    file : curdesc[file] if file in curdesc else None
    for file in files
}

# conform nonexistent
fields = [
    'description'
]

for d in data.keys():
    if data[d] is None:
        data[d] = { f : '' for f in fields}
    else:
        di = data[d]
        for f in fields:
            if f not in di:
                di[f] = ''

        todel = []
        for dk in di.keys():
            if dk not in fields:
                todel.append(dk)

        for td in todel:
            del data[d][td]

# dump
with open(os.path.join(thisdir, "metadata.json"), "w", encoding="utf-8") as file:
    json.dump(data, file, indent=2)