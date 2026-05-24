
const dragDiv = document.getElementById('preview');
const handle = document.getElementById('pvbar');

let draggingpv = false;
let offsetX, offsetY;

handle.addEventListener('mousedown', (e) => {
    draggingpv = true;
    dragE = e;
    
    offsetX = e.clientX - dragDiv.offsetLeft;
    offsetY = e.clientY - dragDiv.offsetTop;
    document.body.style.userSelect = 'none';
});

let dragE = null;

document.addEventListener('mousemove', (e) => {
    if (!draggingpv) return;
    dragE = e;
});

const drags = document.getElementsByClassName('pvdrag');
for (let i = 0; i < drags.length; i++) {
    let d = drags.item(i);

    d.addEventListener('mousedown', e => startResize(d.id.slice(3, 5), e));
}

let resizeStartE, resizingCorner;
let resizing = false;

// resize start window ..
let rsswLeft, rsswTop, rsswWidth, rsswHeight;

function startResize(corner, e) {
    resizeStartE = e;
    resizing = true;
    resizingCorner = corner;

    rsswLeft = dragDiv.style.left;
}

function dragAnim() {
    if (draggingpv) {
        dragDiv.style.left = `${dragE.clientX - offsetX}px`;
        dragDiv.style.top = `${dragE.clientY - offsetY}px`;
    }

    if (resizing) {
        switch (resizingCorner) {
            case 'tl':

                break;
            case 'tr':

                break;
            case 'bl':

                break;
            case 'br':

                break;
        }
    }

    requestAnimationFrame(dragAnim);
}

requestAnimationFrame(dragAnim);

document.addEventListener('mouseup', () => {
    draggingpv = false;
    resizing = false;
    document.body.style.userSelect = 'auto';
});

