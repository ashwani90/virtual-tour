import torch
import cv2
import numpy as np
import matplotlib.pyplot as plt
from torchvision.transforms import Compose, ToTensor, Normalize

# Load MiDaS model
model = torch.hub.load("intel-isl/MiDaS", "MiDaS_small")
model.eval()

# Preprocessing function
transform = Compose([
    ToTensor(),
    Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

# Load and preprocess the image
img = cv2.imread("your_image.jpg")
img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
img = cv2.resize(img, (384, 384))
input_tensor = transform(img).unsqueeze(0)

# Run depth estimation
with torch.no_grad():
    depth_map = model(input_tensor)

depth_map = depth_map.squeeze().numpy()
plt.imshow(depth_map, cmap="plasma")
plt.show()
