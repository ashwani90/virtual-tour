const walls = [
    { x: 0, z: -5, width: 10 }, // Example wall positions
    { x: 5, z: 0, width: 10 }
];

const isColliding = (newX, newZ) => {
    return walls.some(wall => {
        return Math.abs(newX - wall.x) < wall.width / 2 && Math.abs(newZ - wall.z) < wall.width / 2;
    });
};

const moveUser = (direction) => {
    const step = 1;
    let cameraTransform = Camera.getCameraTransform();
    let newX = cameraTransform.translateX;
    let newZ = cameraTransform.translateZ;

    switch (direction) {
        case 'forward': newZ -= step; break;
        case 'backward': newZ += step; break;
        case 'left': newX -= step; break;
        case 'right': newX += step; break;
    }

    if (!isColliding(newX, newZ)) {
        cameraTransform.translateX = newX;
        cameraTransform.translateZ = newZ;
        Camera.setCameraTransform(cameraTransform);
    }
};
