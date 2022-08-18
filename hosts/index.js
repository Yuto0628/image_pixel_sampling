/* ファイル読み込み機能 */
document.getElementById("img_input").addEventListener('change',function(){
    draw_canvas();
});

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
/*カラーのプレビューとピックした色がそれぞれ見える機能*/
document.getElementById("canvas").addEventListener('mousemove', function(event){
    rgb_list = get_mouse_on_color(event);
    show_mouse_on_color(rgb_list);
})

document.getElementById("canvas").addEventListener('mousedown', function(event){
    rgb_list = get_mouse_on_color(event);
    show_clicked_color(rgb_list);
})

function get_mouse_on_color(event){
    // (parameter) event: MouseEvent
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext('2d');

    const rect = event.target.getBoundingClientRect();
    const mouseX = event.clientX - Math.floor(rect.left);
    const mouseY = event.clientY - Math.floor(rect.top);
    const imagedata = ctx.getImageData(mouseX, mouseY, 1, 1);

    const rgb_list = [imagedata.data[0], imagedata.data[1], imagedata.data[2]];
    return rgb_list;
}

function show_mouse_on_color(rgb_list){
    const hsv = rgb2hsv(rgb_list[0], rgb_list[1], rgb_list[2]);
    const str_rgb = 'rgb('+[rgb_list[0], rgb_list[1], rgb_list[2]].join(',') + ')';
    const pic_color = document.getElementById("pic_color");

    pic_color.style.setProperty('--mouse-overed-color', str_rgb);
}

function show_clicked_color(rgb_list){
    const hsv = rgb2hsv(rgb_list[0], rgb_list[1], rgb_list[2]);
    const str_rgb = 'rgb('+[rgb_list[0], rgb_list[1], rgb_list[2]].join(',') + ')';
    const pic_color = document.getElementById("pic_color");

    pic_color.style.setProperty('--clicked-color', str_rgb);
    document.getElementById("h").innerHTML = parseInt(hsv[0]);
    document.getElementById("s").innerHTML = parseInt(hsv[1]);
    document.getElementById("v").innerHTML = parseInt(hsv[2]);
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
    const h = document.getElementById("h").innerHTML;
    const s = document.getElementById("s").innerHTML;
    const v = document.getElementById("v").innerHTML;
    let memo_str = document.getElementById("memo").value;
    pallets.insertAdjacentHTML('beforeend', '<div class="pallet"><div class="pallet_color"></div><div class="pallet_name"></div></div>');
    pallets.lastElementChild.style.backgroundColor = preview_pallet.style.backgroundColor;
    const color_str = 'h:'+h+' s:'+s+' v:'+v;
    pallets.lastElementChild.getElementsByClassName("pallet_color")[0].insertAdjacentHTML('beforeend',color_str);
    if(memo_str==''){
        memo_str = "名前なし";
    }
    pallets.lastElementChild.getElementsByClassName("pallet_name")[0].insertAdjacentHTML('beforeend',memo_str);
}