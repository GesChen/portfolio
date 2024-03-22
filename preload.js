var extrainfoJson;
fetch('extrainfo.json').then((response)=>response.json()).then((json)=> {
    extrainfoJson = json;
    console.log(extrainfoJson); 
    for (let key in extrainfoJson) {
        let location = extrainfoJson[key]['location'];
        
        let image = new Image();
        image.src = location;
    }
});