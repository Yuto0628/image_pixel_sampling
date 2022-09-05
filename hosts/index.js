/* ファイル読み込み機能 */
document.getElementById("img_input").addEventListener('change',function(){
    draw_canvas();
});

function draw_canvas(){
    const image = document.getElementById("image");
    const img_input = document.getElementById("img_input");
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext('2d');
    let width;
    let height;
    let fileReader = new FileReader();
    fileReader.onload = (function(event) {
        const img = new Image();
        img.onload = (function(){
            width  = img.width;
            height = img.height;
            width_div = image.clientWidth;
            height_div = image.clientHeight;
            rate = Math.min(height_div/height,width_div/width);
            canvas.width  = parseInt(width*rate);
            canvas.height = parseInt(height*rate);

            ctx.drawImage(img,0,0,width*rate,height*rate);
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
    const preview_pallet = document.getElementById("pic_color");
    const pallets = document.getElementById("pallets");
    const h = document.getElementById("h").innerHTML;
    const s = document.getElementById("s").innerHTML;
    const v = document.getElementById("v").innerHTML;
    const color_str = 'h:'+h+' s:'+s+' v:'+v;
    let tag_name = document.getElementById("tag").value;
    if(tag_name==''){tag_name = "名前なし";}
    let memo_str = document.getElementById("memo").value;
    if(memo_str==''){memo_str = "名前なし";}
    const pallet_block_template = document.getElementById("pallet_block_template");
    const pallet_blocks = document.getElementsByClassName("pallet_block");
    let is_tag_already_exist = false;
    for(let i=1;i<pallet_blocks.length;i++){//初めのテンプレートを除外するため1からスタート
        const target_pallet_block = pallet_blocks[i];
        if(target_pallet_block.getElementsByClassName("pallet_tag")[0].textContent == tag_name){
            is_tag_already_exist = true;
            break;
        }
    }
    if(!is_tag_already_exist){
        new_pallet_block = pallet_block_template.cloneNode(true);
        new_pallet_block.removeAttribute("id");
        new_pallet_block.getElementsByClassName("pallet_tag")[0].textContent = tag_name;
        pallets.append(new_pallet_block);
    }
    for(let i=1;i<pallet_blocks.length;i++){
        const target_pallet_block = pallet_blocks[i];
        const pallet_list = target_pallet_block.getElementsByClassName("pallet_list")[0];
        if(target_pallet_block.getElementsByClassName("pallet_tag")[0].textContent == tag_name){
            pallet_list.insertAdjacentHTML('beforeend', '<div class="pallet"><div class="pallet_color"></div><div class="pallet_name"></div></div>');
            pallet_list.lastElementChild.style.backgroundColor = preview_pallet.style.getPropertyValue('--clicked-color');
            pallet_list.lastElementChild.getElementsByClassName("pallet_color")[0].insertAdjacentHTML('beforeend',color_str);
            pallet_list.lastElementChild.getElementsByClassName("pallet_name")[0].insertAdjacentHTML('beforeend',memo_str);
            break;
        }
    }
}

/* パレットのデータをjsonファイルとしてローカルストレージに出力 */
document.getElementById("btn_save_pallets").addEventListener('click', function(){
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
