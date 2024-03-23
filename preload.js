var extrainfoJson;

(async () => {
    try {
        const response = await fetch('extrainfo.json');
        const json = await response.json();
        extrainfoJson = json;
        
        for (let key in extrainfoJson) {
            console.log(`loading ${key}`);
            let location = extrainfoJson[key]['location'];
            let image = new Image();
            image.src = location;

            await new Promise(resolve => setTimeout(resolve, 100));
        }
        console.log("finished loading");
    } catch (error) {
        console.error('Error fetching extrainfo.json:', error);
    }
})();
