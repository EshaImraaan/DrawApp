const undoStack = [];


const canvas = document.getElementById('drawing-board');
const toolbar = document.getElementById('toolbar');
const ctx = canvas.getContext('2d');

const canvasOffsetX = canvas.offsetLeft;
const canvasOffsetY = canvas.offsetTop;

canvas.width = window.innerWidth - canvasOffsetX;
canvas.height = window.innerHeight - canvasOffsetY;

let isPainting = false;
let lineWidth = 2;
let startX;
let startY;

toolbar.addEventListener('click', e => {
    if (e.target.id === 'clear') {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
});

toolbar.addEventListener('change', e => {
    if(e.target.id === 'stroke') {
        ctx.strokeStyle = e.target.value;
    }


    //to prevent linewidth to be lower than 1 ie 0 or negative
if (e.target.id === 'lineWidth') {
    const value = parseInt(e.target.value);
    if (isNaN(value) || value < 1) {
        e.target.value = 1;
        lineWidth = 1;
    } else {
        lineWidth = value;
    }
}


    
});

const draw = (e) => {
    if(!isPainting) {
        return;
    }

    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';

    ctx.lineTo(e.clientX - canvasOffsetX, e.clientY);
    ctx.stroke();
}

canvas.addEventListener('mousedown', (e) => {
    undoStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
if (undoStack.length > 20) undoStack.shift(); // Optional: Limit undo history

    isPainting = true;
    startX = e.clientX;
    startY = e.clientY;
});

canvas.addEventListener('mouseup', e => {
    isPainting = false;
    ctx.stroke();
    ctx.beginPath();
});

canvas.addEventListener('mousemove', draw);
//to download drawing
 document.getElementById('save').addEventListener('click', () => {
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');

    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;

    // Fill with white background first
    tempCtx.fillStyle = 'white';
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

    // Draw original canvas on top
    tempCtx.drawImage(canvas, 0, 0);

    const link = document.createElement('a');
    link.download = 'my_drawing.png';
    link.href = tempCanvas.toDataURL('image/png');
    link.click();
});


document.getElementById('undo').addEventListener('click', () => {
    if (undoStack.length > 0) {
        const imageData = undoStack.pop();
        ctx.putImageData(imageData, 0, 0);
    }
});
