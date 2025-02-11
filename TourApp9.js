const teleportLocations = {
    livingRoom: { x: 0, z: 0 },
    kitchen: { x: 5, z: -5 },
    bedroom: { x: -5, z: 5 }
};

const teleportUser = (scene) => {
    let cameraTransform = Camera.getCameraTransform();
    cameraTransform.translateX = teleportLocations[scene].x;
    cameraTransform.translateZ = teleportLocations[scene].z;
    Camera.setCameraTransform(cameraTransform);
};

const TourApp = () => {
    return (
        <View>
            <VrButton style={styles.button} onClick={() => teleportUser('kitchen')}>
                <Text style={styles.buttonText}>Teleport to Kitchen</Text>
            </VrButton>
            <VrButton style={styles.button} onClick={() => teleportUser('bedroom')}>
                <Text style={styles.buttonText}>Teleport to Bedroom</Text>
            </VrButton>
        </View>
    );
};
