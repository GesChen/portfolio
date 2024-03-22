function fetchImage(path) {
    var img = new Image();
    img.onload = function() {
        console.log('Image loaded successfully');
        document.body.appendChild(img);
    };
    img.onerror = function() {
        console.error('Error loading image');
    };
    img.src = path;
}
function setPosAndSize(element, left, top, width, height) {  
    element.style.left = left + 'px';
    element.style.top = top + 'px';
    element.style.width = width + 'px';
    element.style.height = height + 'px';
}
function parseUnitString(value) {
    const unit = value.slice(-2).toLowerCase(); // Extract the unit (last 2 characters)
    const numberValue = parseFloat(value.slice(0, -2)); // Extract the numerical value
  
    if (isNaN(numberValue)) {
      return NaN; // Handle invalid number
    }
  
    switch (unit) {
      case "px":
        return numberValue;
      case "vh":
        return numberValue * window.innerHeight / 100;
      case "vw":
        return numberValue * window.innerWidth / 100;
      default:
        return NaN; // Handle unsupported units
    }
}
function getTextHeight(text, font) {
    // re-use canvas object for better performance
    const canvas = getTextHeight.canvas || (getTextHeight.canvas = document.createElement("canvas"));
    const context = canvas.getContext("2d");
    context.font = font;
    const metrics = context.measureText(text);
    return metrics.height;
}
var extrainfoJson;
fetch('extrainfo.json').then((response)=>response.json()).then((json)=>extrainfoJson = json);

var currentIconElement;

window.onload = function(){

    const mielement = document.getElementById('mielement');
    const miparent = document.getElementById('miparent');
    const mibgblur = document.getElementById('mibgblur');

    // all icons can get clicked
    var iconDivs = document.getElementsByClassName('icon');
    for (var i = 0; i < iconDivs.length; i++) {
        iconDivs[i].addEventListener('click', function() {
            currentIconElement = this;
            //this.classList.add('clicked');
            //document.getElementById('fullview').classList.add('fullviewactive');

            // get src from child image 
            var source = this.getElementsByClassName('imagepreview')[0].src;
            var sourceparts = source.split('/');
            var imageName = decodeURIComponent(sourceparts[sourceparts.length - 1]);
            console.log(`Showing ${imageName}`);

            const extrainfo = extrainfoJson[imageName];
            const title = extrainfo['title'];
            const src = extrainfo['location']
            
            //blur
            //const mititlect = document.getElementById('mititlect'); //title container
            //const mititle = document.getElementById('mititle');
            mielement.src = src;
            //mititle.textContent = title;

            const rect = this.getBoundingClientRect();
            
            const paddingviewportunits = 2;

            miparent.style.display = 'block';
            miparent.style.aspectRatio = rect.width+'/'+rect.height;
            setPosAndSize(miparent, rect.left, rect.top, rect.width, rect.height);

            /*
            // adjust title text
            const subtext = this.getElementsByClassName('subtext')[0];
            const subtextrect = subtext.getBoundingClientRect();
            mititle.style.fontSize = window.getComputedStyle(subtext).fontSize;
            mititle.style.padding = window.getComputedStyle(subtext).padding;
            mititlect.style.position = "fixed";
            
            // divide by 1.04 because we scale the icon by that much, stupid hack but works kidan???
            setPosAndSize(mititlect, subtextrect.left, subtextrect.top, subtextrect.width / 1.04, subtextrect.height / 1.04);
            */

            // get the big image dimensions
            const image = new Image();
            image.src = src;
            image.onload = function() {
                const width = this.width;
                const height = this.height;

                setTimeout(() => {
                    //mititlect.style.transition = "inherit";

                    miparent.style.aspectRatio = width+'/'+height;
                    let displayheight = window.innerWidth / (width / height);

                    mielement.style.borderRadius = 0;
                    mielement.style.borderColor = 'ivory';
                    mielement.style.boxShadow = '0 0 20px -5px ivory';

                    mibgblur.style.filter = 'blur(5px)';
                    
                    var titleoffset;
                    if (displayheight < window.innerHeight) { // center vertically, stretch to sides
                        miparent.style.left = 0;
                        let displayheight = window.innerWidth / (width / height);
                        let center = window.innerHeight / 2;
                    
                        miparent.style.top = (center - displayheight / 2)+'px';
                        
                        miparent.style.padding = paddingviewportunits+'vw';

                        let fswidth = (100-paddingviewportunits * 2);
                        miparent.style.width = fswidth+'vw';
                        miparent.style.height = fswidth / (width / height) + 'vw';

                        titleoffset = paddingviewportunits * window.innerWidth / 100;
                    }
                    else {
                        miparent.style.top = 0;
                        let displaywidth = window.innerHeight * (width / height);
                        let center = window.innerWidth / 2;
                    
                        miparent.style.left = (center - displaywidth / 2)+'px';
                        
                        miparent.style.padding = paddingviewportunits+'vh';

                        let fsheight = (100-paddingviewportunits * 2)
                        miparent.style.height = fsheight+'vh';
                        miparent.style.width = fsheight * (width / height) + 'vh';

                        titleoffset = paddingviewportunits * window.innerHeight / 100;
                    }
                    /*
                    mititlect.style.width  = parseUnitString(miparent.style.width) + 1 + 'px';
                    mititlect.style.height = parseUnitString(miparent.style.height) + 1 + 'px';
                    mititlect.style.left   = parseUnitString(miparent.style.left) + Math.ceil(titleoffset) + 'px';
                    mititlect.style.top    = parseUnitString(miparent.style.top) + Math.ceil(titleoffset) + 'px';
                    mititlect.style.transform = "scale(1)";
                    mititle.style.fontSize = "60px";
                    //mititle.style.webkitTextStrokeWidth = "1px";
                    console.log(miparent.style.left);*/
                }, 10);
            }
        });
    }

    document.getElementById('mielement').addEventListener('click', function() {
        const iconRect = currentIconElement.getBoundingClientRect();
        miparent.style.padding = 0;
        mielement.style.borderRadius = null;
        mielement.style.borderColor = 'transparent';
        mielement.style.boxShadow = "";
        mibgblur.style.filter = 'blur(0)';
        setPosAndSize(miparent, iconRect.left, iconRect.top, iconRect.width, iconRect.height);
        
        const duration = getComputedStyle(miparent).getPropertyValue('--fullscreen-transition-time');
        setTimeout(() => {
            miparent.style.display = 'none';
        }, (duration.slice(0, -1)) * 1000);
    });
    /*document.getElementById('fullviewreturn').addEventListener('click', function() {
        console.log('returning');
        document.getElementById('fullview').classList.remove('fullviewactive');
        for (var i = 0; i < iconDivs.length; i++) {
            iconDivs[i].classList.remove('clicked');
        }
    })*/
}