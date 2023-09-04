const canvas = document.querySelector("canvas"),
toolBtns = document.querySelectorAll(".tool"),
fillColor = document.querySelector("#fill-color"),
sizeSilider = document.querySelector("#size-slider"),
colorBtns = document.querySelectorAll(".colors .opcion"),
colorPiker = document.querySelector("#color-picker"),
clearCanvas = document.querySelector(".clear-canvas"),
saveImg = document.querySelector(".save-img"),
context = canvas.getContext("2d");


//let entrada = document.g

let prevMouseX, prevMouseY, snapshot,
esDrawing = false,
selectedTool = "brush",
brushWidh = 2,
selectedColor = "#000";

window.addEventListener("load", () =>{
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
});

function rectangulo (){

};

const drawRect = (e) => {
    if(!fillColor.checked){
        let rec = context.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
        rec = new Object();
        return rec
    }
    context.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
}

const drawCircle = (e) => {
    context.beginPath();
    let radio = Math.sqrt(Math.pow((prevMouseX - e.offsetX), 2) + Math.pow((prevMouseY - e.offsetY), 2));
    context.arc(prevMouseX, prevMouseY, radio, 0, 2 * Math.PI);
    fillColor.checked ? context.fill() : context.stroke();
}

const drawTriang = (e) => {
    context.beginPath(prevMouseX, prevMouseY);
    context.moveTo(prevMouseX, prevMouseY);
    context.lineTo(e.offsetX, e.offsetY);
    context.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY);
    context.closePath();
    fillColor.checked ? context.fill() : context.stroke();
}

const drawLinea = (e) => {
    context.beginPath(prevMouseX, prevMouseY);
    context.moveTo(prevMouseX, prevMouseY);
    context.lineTo(e.offsetX, e.offsetY);
    context.stroke();
}
/*
const drawT = (e) =>{
    context.beginPath();
    context.direction = "ltr"
    context.fillText(texto ,prevMouseX, prevMouseY);
    context.stroke();
}
*/
const moverImag = (e) => {
    let img = context.getImageData(0, 0, canvas.width, canvas.height);
    context.transform(img, prevMouseX, prevMouseY, offsetX, offsetY);
}

const startDraw = (e) => {
    esDrawing = true;
    prevMouseX = e.offsetX;
    prevMouseY = e.offsetY;
    context.beginPath();
    context.lineWidth = brushWidh;
    context.strokeStyle = selectedColor;
    context.fillStyle = selectedColor;
    snapshot = context.getImageData(0, 0, canvas.width, canvas.height);
}

const drawing = (e) => {
    if(!esDrawing) return;
    context.putImageData(snapshot, 0, 0);

    if(selectedTool === "brush" || selectedTool === "borrador"){
        context.strokeStyle = selectedTool === "borrador" ? "#fff" : selectedColor;
        context.lineTo(e.offsetX, e.offsetY);
        context.stroke();
    } else if(selectedTool === "rectangulo"){
        drawRect(e);
    }else if(selectedTool === "circulo"){
        drawCircle(e);
    }else if(selectedTool === "triangulo"){
        drawTriang(e);
    }else if(selectedTool === "linea"){
        drawLinea(e);
    }else if(selectedTool === "mover"){
        moverImag(e);
    }else {
        drawT(e);
    }
    
}

toolBtns.forEach(btn => {
    btn.addEventListener("click", () =>{
        document.querySelector(".opciones .active").classList.remove("active");
        btn.classList.add("active");
        selectedTool = btn.id;
        console.log(selectedTool);
    });
});

sizeSilider.addEventListener("change", () => brushWidh = sizeSilider.value);

colorBtns.forEach(btn => {
    btn.addEventListener("click", () =>{
        document.querySelector(".opciones .selected").classList.remove("selected");
        btn.classList.add("selected");
        selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color");
    });
});

colorPiker.addEventListener("change", () => {
    colorPiker.parentElement.style.background = colorPiker.value;
    colorPiker.parentElement.click();
});

clearCanvas.addEventListener("click", () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
});
saveImg.addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = `${Date.now()}.jpg`;
    link.href = canvas.toDataURL();
    link.click();
});

canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", () => esDrawing = false);
