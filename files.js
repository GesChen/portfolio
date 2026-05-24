// dont need to recompute
const iconnamecache = {};

let all = []; // elements

fetch('assets/files.json')
    .then(response => response.json())
    .then(data => {
        const items = document.getElementById("items");
        data.forEach(file => {
            const itemDiv = document.createElement("div");
            itemDiv.className = "item";
            itemDiv.id = file;

            const nameSpan = document.createElement("span");
            nameSpan.className = "itemname";
            nameSpan.textContent = file;
            
            // hack replace mp4 icon
            var icon = file;
            if (file.slice(-1) === '4') 
                icon = file.slice(0, -3) + 'jpg';
            // same for md
            if (file.slice(-1) === 'd') 
                icon = 'text.png';

            // now for graphs
            if (file.slice(-1) === 'h') 
                icon = file.slice(0, -5) + 'png';

            iconnamecache[file] = icon;

            const imageDiv = document.createElement("div");
            imageDiv.className = "itemimage";
            imageDiv.style.backgroundImage = `url('assets/icons/${icon}')`;

            itemDiv.appendChild(imageDiv);
            itemDiv.appendChild(nameSpan);
            items.appendChild(itemDiv);

            itemDiv.addEventListener('dblclick', () => preview(file));
            itemDiv.addEventListener('click', () => select(file, itemDiv));
        
            itemDiv.addEventListener('mouseenter', () => mouseOverBg = false);
            itemDiv.addEventListener('mouseleave', () => mouseOverBg = true);

            all.push(itemDiv);
        });

        document.getElementById('totalcount').textContent = `${data.length} items   ︱ `;
    })
    .then(() => { testItem = document.getElementsByClassName('item')[0] })
    .catch(err => console.error(err));

let metadata = null; 
fetch('assets/metadata.json')
    .then(r => r.json())
    .then(d => metadata = d)
    .catch(err => console.error(err));

// set up folders
let folders = {}; // name : [element, element..]
fetch('assets/folders.json')
    .then(r => r.json())
    .then(fs => {
        const cont = document.getElementById('folders');
        for (let f in fs) {
            if (f === 'unsorted') continue;
            
            let elements = [];
            fs[f].forEach(file => {
                elements.push(document.getElementById(file));
            });
            folders[f] = elements;

            let main = document.createElement('div');
            main.classList.add('folder');
            main.id = f;
            main.addEventListener('click', () => selectfolder(f));

            let icon = document.createElement('div');
            icon.classList.add('foldericon');

            let name = document.createElement('span');
            name.classList.add('foldername');
            name.textContent = f;

            main.appendChild(icon);
            main.appendChild(name);

            cont.insertBefore(main, cont.firstChild);
        }
    })
    .catch(err => console.error(err));


let navbaradded = [];
const navlast = document.getElementById('navlast');

function selectfolder(name) {
    // hide all
    all.forEach(f => {
        f.style.display = 'none';
    });

    // unhide folder contents
    folders[name].forEach(f => {
        f.style.display = '';
    });

    navlast.textContent = name;
}

const pvelem = document.getElementById('preview');
const pvcontent = document.getElementById('pvcontent');
const pvname = document.getElementById('pvname');

async function preview(file) {
    pvcontent.innerHTML = '';
    document.body.style.cursor = 'wait';

    pvelem.style.display = 'flex';

    pvname.textContent = "";

    await fetch(`assets/files/${file}`);

    var itemDiv; 
    const ext = file.slice(file.lastIndexOf('.')).toLowerCase();
    switch (ext) {
        case '.jpg':
        case '.jpeg':
        case '.png':
            itemDiv = document.createElement("div");
            itemDiv.style.backgroundImage = `url('assets/files/${file}')`;
            break;
        case '.mp4':
            itemDiv = document.createElement('video');
            itemDiv.src = `assets/files/${file}`;
            itemDiv.controls = true;
            itemDiv.autoplay = true;
            itemDiv.loop = true;
            break;
        case '.md':
            itemDiv = document.createElement("div");

            fetch(`assets/files/${file}`)
                .then(res => res.text())
                .then(text =>
                    itemDiv.innerHTML = text);

            break;
        case '.graph':
            itemDiv = document.createElement("div");
            itemDiv.style.width = '100%';
            itemDiv.style.height= '100%';

            var graphDiv = document.createElement('iframe');
            itemDiv.appendChild(graphDiv);
            
            var linkDiv = document.createElement('a');
            linkDiv.target = '_blank';
            linkDiv.style.textAlign = 'center';
            linkDiv.style.display = 'inline-block';
            linkDiv.style.height = 'fit-content';
            linkDiv.style.color = 'lightslategray';

            itemDiv.appendChild(linkDiv);
            
            fetch(`assets/files/${file}`)
                .then(res => res.text())
                .then(text => {
                    graphDiv.src = text;
                    linkDiv.href = text;
                    linkDiv.textContent = text;
                });
    }

    pvname.textContent = file;
    pvcontent.appendChild(itemDiv, pvcontent.firstChild);
    
    await new Promise(resolve => setTimeout(resolve, 200)); // artificial wait 
    // pjpeg loads kinda slow still
    document.body.style.cursor = 'default';
}

let shift = false;
document.addEventListener('keydown', (e) => { if (e.key == "Shift") shift = true; });
document.addEventListener('keyup', (e) => { if (e.key == "Shift") shift = false; });

const descPrev = document.getElementById("descprev");
const descText = document.getElementById('desctext');
const selectedcount = document.getElementById('selectedcount');

let selected = [];

async function select(file, itemDiv) {
    if (!shift) {
        desel();
    }

    if (!shift) selected = []
    selected.push(file);
    
    itemDiv.classList.add('selected');

    // load prev into the box and metadata
    if (file.endsWith('g'))
        descPrev.style.backgroundImage = `url('assets/files/${file}')`
    else 
        descPrev.style.backgroundImage = `url('assets/icons/${iconnamecache[file]}')`

    // just desc for now
    descText.textContent = metadata[file]['description'];

    // update selected count
    selectedcount.textContent = `${selected.length} item${
        selected.length > 1 ? 's' : ''} selected  ︱`;
}

function desel() { 
    selected.forEach(e => document.getElementById(e).classList.remove('selected'));
}

let mouseOverBg = true;

document.getElementById('items').addEventListener('mousedown', () => {
    if (!mouseOverBg) return;
    
    desel();
    selected = [];
    selectedcount.textContent = '';
})

document.addEventListener('keydown', (e) => {
    if (e.key == "Enter" && selected.length == 1)
        preview(selected[0]);
})

const pvx = document.getElementById('pvxbutton');
pvx.addEventListener('click', () => {
    pvelem.style.display = 'none';
});

document.addEventListener('keydown', (e) => { 
    if (e.key == "Escape") pvelem.style.display = 'none'; 
})

var contentfull = false;
pvcontent.addEventListener('click', ()=>{
    contentfull = !contentfull;


});


var testItem;

// arrow nav
document.addEventListener('keydown', (e) => {
    if (selected.length == 0) return;

    var sx = testItem.offsetWidth;
    var sy = testItem.offsetHeight;

    switch (event.key) {
        case "ArrowLeft":
            selectoff(-sx, 0, e);
            break;
        case "ArrowRight":
            selectoff(sx, 0, e);
            break;
        case "ArrowUp":
            selectoff(0, -sy, e);
            break;
        case "ArrowDown":
            selectoff(0, sy, e);
            break;
    }
})

const items = document.getElementById('items');

function indexselect(indexoff) {

}

function selectoff(offx, offy, e) {
    e.preventDefault();

    var ref = document.getElementById(selected.at(-1));
    var rect = ref.getBoundingClientRect();
    var cx = rect.left + rect.width / 2;
    var cy = rect.top + rect.height / 2;
    var px = cx + offx;
    var py = cy + offy;


    if (cy + offy > window.innerHeight - rect.height / 2) {
        items.scrollBy(0, 
            (rect.bottom + rect.height) - window.innerHeight + 50);

        py = window.innerHeight - 50;
    }
    if (cy + offy < rect.height / 2 + 20) {
        items.scrollBy(0, 
            rect.top - rect.height - 40
        );

        py = 50;
    }

    var item = itemAt(px, py);
    if (item == null) return;
    var id = item.id;

    select(id, item);

    
}

function itemAt(x, y) {
    var elements = document.elementsFromPoint(x, y)
    return elements.find((e) => e.classList.contains('item'))
}