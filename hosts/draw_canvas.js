MAX_SCALE = 5;
let scale = 1;
let img;
/* ファイル読み込み機能 */
document.getElementById("img_input").addEventListener('change',async function(){
    await load_image();
    draw_canvas();
});

/* 拡大・縮小検出、canvas調整機能*/
document.getElementById("canvas").addEventListener('wheel',change_zoom);

async function load_image(){
    const img_input = document.getElementById("img_input");
    return new Promise((resolve) => {
        let fileReader = new FileReader();
        fileReader.onload = (function(event) {
            img = new Image();
            img.onload = (function(){
                resolve();
            });
            img.src = event.target.result;
        });
        fileReader.readAsDataURL(img_input.files[0]);
    });
}

function draw_canvas(){
    const canvas = document.getElementById("canvas");
    const image = document.getElementById("image");
    const ctx = canvas.getContext('2d');
    const img_width = img.width;
    const img_height = img.height;
    const div_width = image.clientWidth;
    const div_height = image.clientHeight;
    rate = Math.min(div_height/img_height,div_width/img_width);
    canvas.width  = parseInt(img_width*rate);
    canvas.height = parseInt(img_height*rate);
    ctx.drawImage(img,0,0,img_width*rate*scale,img_height*rate*scale);
}

function change_zoom(event){
    event.preventDefault();
    scale = Math.min(Math.max(1,scale+event.deltaY*-0.005),MAX_SCALE);
    draw_canvas();
}