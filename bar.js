// percents
const splitminl = 5;
const splitmaxl = 20;
const splitminr = 70;
const splitmaxr = 90;

const root = document.documentElement;
const barl = document.getElementById('barl');
const barr = document.getElementById('barr');

let draggingbarl = false;
let draggingbarr = false;

barl.addEventListener('mousedown', () => draggingbarl = true);
barr.addEventListener('mousedown', () => draggingbarr = true);
document.addEventListener('mouseup', () => {
    draggingbarl = false;
    draggingbarr = false;
});
document.addEventListener('mousemove', e => {
    if (draggingbarl) {
        var split = (e.clientX / window.innerWidth) * 100;
        split = Math.min(Math.max(split, splitminl), splitmaxl);
        root.style.setProperty('--splitl', `${split}%`);
    }
    if (draggingbarr) {
        var split = (e.clientX / window.innerWidth) * 100;
        split = Math.min(Math.max(split, splitminr), splitmaxr);
        root.style.setProperty('--splitr', `${split}%`);
    }
});
