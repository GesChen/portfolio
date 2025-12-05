const splitmin = 5;
const splitmax = 20;

const root = document.documentElement;
const bar = document.getElementById('bar');

let draggingbar = false;

bar.addEventListener('mousedown', () => draggingbar = true);

document.addEventListener('mouseup', () => {
    draggingbar = false;
});

document.addEventListener('mousemove', e => {
    const vw = window.innerWidth;

    if (draggingbar) {
        var split = (e.clientX / vw) * 100;
        split = Math.min(Math.max(split, splitmin), splitmax);
        root.style.setProperty('--split', `${split}%`);
    }
});

// preview ----------
const dragDiv = document.getElementById('preview');
const handle = document.getElementById('pvbar');

let draggingpv = false;
let offsetX, offsetY;

handle.addEventListener('mousedown', (e) => {
    draggingpv = true;
    offsetX = e.clientX - dragDiv.offsetLeft;
    offsetY = e.clientY - dragDiv.offsetTop;
    document.body.style.userSelect = 'none';
});

document.addEventListener('mousemove', (e) => {
    if (!draggingpv) return;
    dragDiv.style.left = `${e.clientX - offsetX}px`;
    dragDiv.style.top = `${e.clientY - offsetY}px`;
});

document.addEventListener('mouseup', () => {
    draggingpv = false;
    document.body.style.userSelect = 'auto';
});
