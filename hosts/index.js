/* ファイル読み込み機能 */
document.getElementById("img_input").addEventListener('change',function(){
    draw_canvas();
});
get_clicked_color();

function draw_canvas(){
    console.log("start draw_canvas");
    const img_input = document.getElementById("img_input");
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext('2d');
    let fileReader = new FileReader();
    fileReader.onload = (function(event) {
        const img = new Image();
        img.onload = (function(){
            ctx.drawImage(img,0,0,400,400);
        })
    img.src = event.target.result;
    });
    fileReader.readAsDataURL(img_input.files[0]);
}

function get_clicked_color(){
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext('2d');
    let r, g, b;
    let hsv;
    canvas.onclick = function(e){
        const rect = e.target.getBoundingClientRect();
        let mouseX = e.clientX - Math.floor(rect.left);
        let mouseY = e.clientY - Math.floor(rect.top);

        let imagedata = ctx.getImageData(mouseX, mouseY, 1, 1);
        r = imagedata.data[0];
        g = imagedata.data[1];
        b = imagedata.data[2];
        hsv = rgb2hsv(r, g, b);
        
        document.getElementById("pic_color").style.backgroundColor = 'rgb('+[r,g,b].join(',') + ')'
        document.getElementById("h").innerHTML = parseInt(hsv[0]);
        document.getElementById("s").innerHTML = parseInt(hsv[1]);
        document.getElementById("v").innerHTML = parseInt(hsv[2]);
    }
}

function rgb2hsv(r, g, b){
    r /= 255;
    g /= 255;
    b /= 255;
    const v = Math.max(r, g, b),
        n = v - Math.min(r, g, b);
    const h = 
        n === 0 ? 0 : n && v === r ? (g - b)/n : v === g ? 2 + (b - r)/n : 4 + (r - g)/n;
    return [60 * (h < 0 ? h + 6 : h), v && (n / v) * 100, v * 100];
}

/* 色保存機能 */
document.getElementById("btn_add_to_pallet").addEventListener('click',function(){
    save_to_pallet();
})

function save_to_pallet(){
    console.log("clicked_save_to_pallet");
    const preview_pallet = document.getElementById("pic_color");
    const pallets = document.getElementById("pallets");
    const pallet = pallets.insertAdjacentHTML('beforeend', '<div class="pallet" ></div>');
    pallet.backgroundColor = 'rgb('+[r,g,b].join(',') + ')'
}