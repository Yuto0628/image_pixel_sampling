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

/* パレットのデータをjsonファイルとしてローカルストレージに出力 */
document.getElementById("btn_export_pallets_for_json").addEventListener('click', function(){
    generate_json();
})

const generate_json = () => {
    let obj = [];
    const pallets = document.getElementById('pallets');
    const pallet_list = pallets.children;

    for (let i=0; i<pallet_list.length; i++){
        const pallet = pallet_list[i];
        const rgb = pallet.style.backgroundColor;
        //const h = pallet.getElementByClassName("h")[0].textContent;
        //const s = pallet.getElementByClassName("s")[0].textContent;
        //const v = pallet.getElementByClassName("v")[0].textContent;
        const hsv = pallet.getElementsByClassName("pallet_color")[0].textContent;
        const memo = pallet.getElementsByClassName('pallet_name')[0].textContent;

        const pallet_data = {
            hsv : hsv,
            memo : memo,
        }
        obj.push(pallet_data);
    }

    let file_name =  document.getElementById("text_export_file_name").value;
    if(file_name == ''){file_name="パレットデータ";}

    const json_data = JSON.stringify(obj);
    localStorage.setItem(file_name, json_data);
}
