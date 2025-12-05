import os
import shutil
from PIL import Image
import cv2

iconwidth = 200

thisdir = os.path.dirname(os.path.abspath(__file__))
files = [f for f in os.listdir(os.path.join(thisdir, 'files')) if os.path.isfile(os.path.join(thisdir, 'files', f))]
files.sort(key=lambda x:x.lower())

with open('files.json', 'w') as file:
	file.write(
		str(
			files
		).replace("'", '"')
	)
	 
	 
def create_icon_from_video(path):
	print(f'videoing {path}')
	cap = cv2.VideoCapture(path)
	success, frame = cap.read()
	cap.release()
	if not success:
		raise ValueError(f"Cannot read first frame from {path}")
	
	# Convert BGR (OpenCV) to RGB (PIL)
	frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
	img = Image.fromarray(frame)
	
	w_percent = iconwidth / float(img.width)
	height = int(float(img.height) * w_percent)
	img_resized = img.resize((iconwidth, height), Image.LANCZOS)
	
	base_name = os.path.basename(path)
	output_path = os.path.join(thisdir, "icons", base_name)
	output_path = output_path[:-3] + 'jpg'
	
	img_resized.save(output_path)

def texticon(path):
	print(f'text {path}')
	return
	
	base_name = os.path.basename(path)
	output_path = os.path.join(thisdir, "icons", base_name[:-3] + '.png')

	shutil.copyfile(
		os.path.join(thisdir, 'text.png'),
		output_path
	);

def create_icon(path):
	print(f'iconning {path}')
	
	if path[-1] == '4': # mp4 skip hack
		create_icon_from_video(path)
		return
	
	if (path[-1] != 'g'):
		texticon(path)
		return
	
	img = Image.open(path)
	
	w_percent = (iconwidth / float(img.width))
	height = int((float(img.height) * float(w_percent)))
	
	img_resized = img.resize((iconwidth, height), Image.LANCZOS)
	
	base_name = os.path.basename(path)
	output_path = os.path.join(thisdir, "icons", base_name)
	
	img_resized.save(output_path)

for fn in files:
	create_icon(os.path.join(thisdir, 'files', fn))