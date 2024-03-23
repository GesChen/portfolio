var extrainfoJson;

(async () => {
  try {
    const response = await fetch('extrainfo.json');
    const json = await response.json();
    extrainfoJson = json;

    for (let key in extrainfoJson) {
      let location = extrainfoJson[key]['location'];
      let image = new Image();
      image.src = location;
    }
  } catch (error) {
    console.error('Error fetching extrainfo.json:', error);
  }
})();
