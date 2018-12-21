window.onload = function(){

let imgurl = '';

let dic = {
   6:"rotate(90deg)",
   8:"rotate(-90deg)",
   3:"rotate(180deg)",
   1:"unset"
}
function checkStatus(response) {
  console.log("checkStatus:"+response.status)
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

let loadFile = function(file){
    let oReader = new FileReader();
    oReader.readAsDataURL(file);
    return new Promise((resolve,reject)=>{
        oReader.onload = (e)=> {
            resolve(e.target.result)
        }
        oReader.onerror=(err)=>{
            reject(err)
        }
    })
}
let loadImg = function(src){
    let img = new Image();
    img.setAttribute('crossOrigin','anonymous');
    img.src = src;
    return new Promise((resolve,reject)=>{
        img.onload =()=>{
            resolve(img);
        }
        img.onerror=(err)=>{
            reject(err);
        }
    });
}

function rotateimg(file,Orientation,ro=false){
    let p = new Promise((resolve, reject)=>{
      let canvas = document.createElement("canvas");
      loadFile(file).then((src)=>{
      imgurl = src;
      //if(ro){
      loadImg(src).then((img)=>{
        let width = img.naturalWidth;
        let height = img.naturalHeight;
        //if(width > this.limitLength && width >= height) {
        //height = height * this.limitLength / width;
        //  width = this.limitLength;
        //}
        //if(height > this.limitLength && height >= width) {
        //  width = width * this.limitLength / height;
        //  height = this.limitLength;
        //}
        let degree = 90 * Math.PI / 180;
        let ctx = canvas.getContext('2d');
        if (Orientation) {
          switch (Orientation) {
            //case 1://不旋转
            //  canvas.width = width;
            //  canvas.height = height;
            //  ctx.drawImage(img, 0, 0, width, height);
            //  break;
            case 6://需要顺时针（向左）90度旋转
              canvas.width = height;
              canvas.height = width;
              ctx.rotate(degree);
              ctx.drawImage(img, 0, -height, width, height);
              break;
           case 8://需要逆时针（向右）90度旋转
              canvas.width = height;
              canvas.height = width;
              ctx.rotate(degree*3);
              ctx.drawImage(img, -height, 0, height, width);
              break;
           case 3://需要180度旋转
              canvas.width = width;
              canvas.height = height;
              ctx.rotate(degree*2);
              ctx.drawImage(img, -width, -height, width, height);
              break;
          default:
              canvas.width = width;
              canvas.height = height;
              ctx.drawImage(img, 0, 0, width, height);
              break;
          }
        } 
        else {
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);
        } 
        //if(ro){
        //     imgurl = canvas.toDataURL();
        //}
        resolve(canvas.toDataURL());

        //canvas.toBlob((blob)=>{
        //    resolve(blob) //resolve出去确保画图完成
        //  }, 'image/jpeg');
        //})
      })
      //}else{resolve(imgurl)}
    })
  })
  return p;
}

function faceswap(fileinfo){
    console.time("time_used");
    fetch("/seg/cartoon/",{
        body:JSON.stringify({
            "template_id":1,
            "image_info":fileinfo,
        }),
        mode:"cors",
        //credentials:"omit",
        method:"POST",
    })
    .then(res => checkStatus(res))
    .then(res => res.json())
    .then(res => {
         if(res.status != 0){
             alert("ERROR:"+res.msg)
         }else{
    	 document.querySelector("#result").style.backgroundImage = "url("+res.msg+")";
         }
         document.querySelector("#result").innerHTML = "";
         console.timeEnd("time_used");
    }).catch(e=>document.querySelector("#result").innerHTML = e)
}

    document.querySelector("#choosefile").onchange = function(){
        let file = document.querySelector("#choosefile").files[0];
        let Orientation = null;
        let origin_el = document.querySelector("#origin");
        origin_el.innerHTML = "loading...";
        EXIF.getData(file,function(){
            console.log(EXIF.pretty(this));
            Orientation =  EXIF.getTag(this, 'Orientation');
            console.log("Orientation",Orientation);
            rotateimg(file, Orientation)
            .then(res => {
                  origin_el.style.backgroundImage = "url("+res+")";
                  origin_el.innerHTML = "";
                  //if(Orientation){
                  //    origin_el.style.transform = dic[Orientation];
                  //}else{
                  //    origin_el.style.transform = "unset"; 
                  //}
            })
            .catch(res => {origin_el.innerHTML = "Wong image data";})
        })
    }
   /*
    document.querySelector("#ro_r").onclick = function(){
            rotateimg(file, 6,true)
            .then(res => {
                  origin_el.style.backgroundImage = "url("+res+")";
                  origin_el.innerHTML = "";
            })
            .catch(res => {origin_el.innerHTML = "Wong image data";})
            })
    }
    document.querySelector("#ro_l").onclick = function(){
            rotateimg(file, 6,true)
            .then(res => {
                  origin_el.style.backgroundImage = "url("+res+")";
                  origin_el.innerHTML = "";
            })
            .catch(res => {origin_el.innerHTML = "Wong image data";})
            })
    }
    */
    document.querySelector("#start").onclick = function(){
           document.querySelector("#result").innerHTML = "Processing..." 
           faceswap(imgurl);
    }
}

