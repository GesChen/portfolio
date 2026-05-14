// dont need to recompute
const iconnamecache = {};

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
        });

        document.getElementById('totalcount').textContent = `${data.length} items   ︱ `;
    })
    .catch(err => console.error(err));

let metadata = null; 
fetch('assets/metadata.json')
    .then(r => r.json())
    .then (d => metadata = d);

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
    if (e.key == "Escape") pvelem.style.display = 'none'; })

var contentfull = false;
pvcontent.addEventListener('click', ()=>{
    contentfull = !contentfull;


});