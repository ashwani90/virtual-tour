import asyncio
import websockets
import json
from deepface import DeepFace
import cv2

async def send_emotion(websocket, path):
    cap = cv2.VideoCapture(0)
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        
        result = DeepFace.analyze(frame, actions=['emotion'], enforce_detection=False)
        emotion = result[0]['dominant_emotion']

        await websocket.send(json.dumps({"emotion": emotion}))

        await asyncio.sleep(0.5)  # Send emotion updates every 500ms

start_server = websockets.serve(send_emotion, "localhost", 6789)
asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()


