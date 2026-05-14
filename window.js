
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

function dragAnim() {
    if (draggingpv) {
        dragDiv.style.left = `${dragE.clientX - offsetX}px`;
        dragDiv.style.top = `${dragE.clientY - offsetY}px`;
    }
    requestAnimationFrame(dragAnim);
}

requestAnimationFrame(dragAnim);

document.addEventListener('mouseup', () => {
    draggingpv = false;
    document.body.style.userSelect = 'auto';
});
