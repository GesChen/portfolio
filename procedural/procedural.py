import os, shutil
from PIL import Image

folder = "Photography"
files = os.listdir(folder)
previewsfolder = "previews"
htmltxt = 'htmlout.txt'
jsontxt = 'jsonout.txt'
previewheight = 400

with open(htmltxt,'w') as html, open(jsontxt, 'w') as json:
	html.write('    <div class="gridview">\n')
	for file in files:
		if os.path.splitext(file)[1] != '.mp4': 
			# add html to the output txt
			name = os.path.splitext(file)[0].lower()
			html.writelines([l+'\n'for l in [
				f'        <div class="icon"> <!--{name}-->',
				f'            <img class="imagepreview" src="{previewsfolder}\{name}.jpg">',
				r'            <div class="gradientoverlay"></div>',
				f'            <div class="subtext">{name}</div>',
				r'        </div>'
			]])
			
			# add json to output txt
			# make sure the json includes the actual location of the image for js to use
			json.writelines([l+'\n'for l in [
				f'"{name}.jpg":',
				 '{',
				f'    "title":"{name}",',
				f'    "location":"{folder}\\\\{file}"',
				 '},'
			]])

			# resize images to preview scale and add to previews
			image = Image.open(os.path.join(folder, file))

			# Get original width and height
			width, height = image.size

			# Calculate aspect ratio
			aspect_ratio = width / height

			# Calculate new width based on new height and aspect ratio
			new_width = int(previewheight * aspect_ratio)

			# Resize the image with the calculated width and height
			resized_image = image.resize((new_width, previewheight))
			resized_image = resized_image.convert("RGB")
			resized_image.save(os.path.join(previewsfolder,name+'.jpg'))
	html.write('    </div>')