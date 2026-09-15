
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
let movementE = null;

document.addEventListener('mousemove', (e) => {
    movementE = e;

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

let rsOtherCornerX, rsOtherCornerY;

function startResize(corner, e) {
    resizeStartE = e;
    resizing = true;
    resizingCorner = corner;

    let style = getComputedStyle(dragDiv);
    let left = pxValue(style.left);
    let top = pxValue(style.top);
    let width = pxValue(style.width);
    let height = pxValue(style.height);

    let c = corner;
    rsOtherCornerX = left + ((c == 'tl' || c == 'bl') ? 1 : -1) * width / 2;
    rsOtherCornerY = top + ((c == 'tl' || c == 'tr') ? 1 : -1) * height / 2;

    // switch (resizingCorner) {
    //     case 'tl':
    //         rsOtherCornerX = rsswLeft + rsswWidth / 2;
    //         rsOtherCornerY = rsswTop + rsswHeight / 2;
    //         break;
    //     case 'tr':
    //         rsOtherCornerX = rsswLeft - rsswWidth / 2;
    //         rsOtherCornerY = rsswTop + rsswHeight / 2;
    //         break;
    //     case 'bl':
    //         rsOtherCornerX = rsswLeft + rsswWidth / 2;
    //         rsOtherCornerY = rsswTop - rsswHeight / 2;
    //         break;
    //     case 'br':
    //         rsOtherCornerX = rsswLeft - rsswWidth / 2;
    //         rsOtherCornerY = rsswTop - rsswHeight / 2;
    //         break;
    // }
}

function pxValue(v) {
    return Number(v.substring(0, v.length - 2));
}

function dragAnim() {
    if (draggingpv) {
        dragDiv.style.left = `${dragE.clientX - offsetX}px`;
        dragDiv.style.top = `${dragE.clientY - offsetY}px`;
    }

    if (resizing) {
        let width = Math.abs(movementE.clientX - rsOtherCornerX);
        let height = Math.abs(movementE.clientY - rsOtherCornerY);
        let cX = (movementE.clientX + rsOtherCornerX) / 2;
        let cY = (movementE.clientY + rsOtherCornerY) / 2;
        
        dragDiv.style.left = `${cX}px`;
        dragDiv.style.top = `${cY}px`;
        dragDiv.style.width = `${width}px`;
        dragDiv.style.height = `${height}px`;
    }

    requestAnimationFrame(dragAnim);
}

requestAnimationFrame(dragAnim);

document.addEventListener('mouseup', () => {
    draggingpv = false;
    resizing = false;
    document.body.style.userSelect = 'auto';
});

var zoom = 1;
pvcontent.addEventListener('scroll', () => {
    var child = pvcontent.firstChild;

    console.log(e);

    child.style.transform = `scale(${zoom})`;
});
