/* ファイル読み込み機能 */
document.getElementById("img_input").addEventListener('change',function(){
    draw_canvas();
    console.log("added EventListener");
});

function draw_canvas(){
    console.log("start draw_canvas");
    const img_input = document.getElementById("img_input");
    let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext('2d');
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