/* ファイル読み込み機能 */
document.getElementById("img_input").addEventListener('change',function(){
    clear_pallets();
    clear_canvas();
    set_first_option();
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
    const rgb = get_mouse_on_color(event);
    set_mouse_on_color(rgb);
})

document.getElementById("canvas").addEventListener('mousedown', function(event){
    const rgb = get_mouse_on_color(event);
    set_clicked_color(rgb);
})

function get_mouse_on_color(event){
    // (parameter) event: MouseEvent
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext('2d');

    const rect = event.target.getBoundingClientRect();
    const mouseX = event.clientX - Math.floor(rect.left);
    const mouseY = event.clientY - Math.floor(rect.top);
    const imagedata = ctx.getImageData(mouseX, mouseY, 1, 1);

    const rgb = [imagedata.data[0], imagedata.data[1], imagedata.data[2]];
    return rgb;
}

function set_mouse_on_color(rgb_list){
    const hsv = rgb2hsv(rgb_list[0], rgb_list[1], rgb_list[2]);
    const str_rgb = 'rgb('+[rgb_list[0], rgb_list[1], rgb_list[2]].join(',') + ')';
    const pic_color = document.getElementById("pic_color");

    pic_color.style.setProperty('--mouse-overed-color', str_rgb);
}

function set_clicked_color(rgb_list){
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

/* パレットのデータをjson形式でローカルストレージに保存 */
document.getElementById("btn_export_pallets_for_json").addEventListener('click', function(){
    save_json();
    load_keys();
})

function save_json(){
    let save_file = {};

    const img_data = document.getElementById('canvas').toDataURL();
    let file_name = document.getElementById('export_file_name').value;
    if(file_name == ''){file_name = 'パレットデータ'};

    save_file['name'] = file_name;
    save_file['img'] = img_data;
    save_file['blocks'] = document.getElementById('pallets').innerHTML;

    if(localStorage.getItem('save_list') == null){
        console.log('save_list is null');
        let save_name = 'save_list';
        let save_list = [];
        save_list.push(save_file);

        localStorage.setItem(save_name, JSON.stringify(save_list));
        return
    }

    let save_list = JSON.parse(localStorage.getItem('save_list'));
    console.log('save_list: ', save_list);
    for(let i=0; i<save_list.length; i++){
        if(save_file['name'] == save_list[i]['name']){
            save_list[i] = save_file;
            localStorage.setItem('save_list', JSON.stringify(save_list));
            return
        }
    }
    save_list.push(save_file);
    localStorage.setItem('save_list', JSON.stringify(save_list));
}

/* 保存したローカルストレージのjsonファイル名をプルダウンに追加 */
window.addEventListener('DOMContentLoaded', function(){
    load_keys();
})

function load_keys(){
    const select = document.getElementById("local_storage_list");
    remove_options(select);//selectの初期化

    const save_list = JSON.parse(localStorage.getItem('save_list'));
    for(let i=0; i<save_list.length; i++){
        const option = document.createElement("option");
        option.text = save_list[i]['name'];
        select.appendChild(option);
    }
}

function remove_options(elem_select){
    const len_opt = elem_select.options.length - 1;
    for(let i=len_opt; i >= 0; i--){
        elem_select.remove(i+1);
    }
}

document.getElementById('local_storage_list').addEventListener('change', function(){
    load_save_data();
})

function load_save_data(){
    const select = document.getElementById('local_storage_list');
    const save_name = select.value;
    const save_list = JSON.parse(localStorage.getItem('save_list'));

    let save_data;
    try {
        for(let i=0; i<save_list.length; i++){
            if(save_list[i]['name'] == save_name){
                save_data = save_list[i];
            }
        }
        if(save_data==null){
            throw new Error("Cant get save_data");
        }
    } catch{
        //初期化
        clear_pallets();
        clear_canvas();
        return
    }

    const img_data = save_data['img'];
    const blocks_data = save_data['blocks'];

    let pallets = document.getElementById('pallets');
    pallets.innerHTML = blocks_data;


    const image = document.getElementById("image");
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext('2d');
    let width;
    let height;

    const img = new Image();
    img.onload = function(){
        width  = img.width;
        height = img.height;
        width_div = image.clientWidth;
        height_div = image.clientHeight;
        rate = Math.min(height_div/height,width_div/width);
        canvas.width  = parseInt(width*rate);
        canvas.height = parseInt(height*rate);

        ctx.drawImage(img,0,0,width*rate,height*rate);
    }
    img.src = img_data;
}

function clear_canvas(){
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function clear_pallets(){
    const pallet_block_template = document.getElementById('pallet_block_template');
    const pallets = document.getElementById('pallets');
    pallets.innerHTML = pallet_block_template.outerHTML;
}

function set_first_option(){
    const select = document.getElementById('local_storage_list');
    const options = select.options;
    options[0].selected = true;
}