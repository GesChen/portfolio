fetch('assets/files.json')
    .then(response => response.json())
    .then(data => {
        const items = document.getElementById("items");
        data.forEach(file => {
            const itemDiv = document.createElement("div");
            itemDiv.className = "item";

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

            const imageDiv = document.createElement("div");
            imageDiv.className = "itemimage";
            imageDiv.style.backgroundImage = `url('assets/icons/${icon}')`;

            itemDiv.appendChild(imageDiv);
            itemDiv.appendChild(nameSpan);
            items.appendChild(itemDiv);

            itemDiv.addEventListener('dblclick', () => {
            preview(file);
            })
        });

        document.getElementById('statuscount').textContent = `${data.length} items   ︱`;
    })
    .catch(err => console.error(err));

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
    }

    pvname.textContent = file;
    pvcontent.appendChild(itemDiv, pvcontent.firstChild);
    
    await new Promise(resolve => setTimeout(resolve, 200)); // artificial wait 
    // pjpeg loads kinda slow still
    document.body.style.cursor = 'default';
}

const pvx = document.getElementById('pvxbutton');
pvx.addEventListener('click', () => {
    pvelem.style.display = 'none';
});

var contentfull = false;
pvcontent.addEventListener('click', ()=>{
    contentfull = !contentfull;


});