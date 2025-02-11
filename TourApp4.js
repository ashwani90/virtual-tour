import Entity from 'react-360';

const ClickableObject = ({ position, onClick }) => {
    return (
        <VrButton onClick={onClick} style={{ position: 'absolute', left: position[0], top: position[1] }}>
            <Entity source={{ obj: asset('chair.obj'), mtl: asset('chair.mtl') }} />
        </VrButton>
    );
};

const TourApp = () => {
    const [currentScene, setCurrentScene] = useState(scenes.livingRoom);

    const handleObjectClick = () => {
        console.log("User clicked on an object!");
    };

    return (
        <View>
            <ClickableObject position={[200, 300]} onClick={handleObjectClick} />
        </View>
    );
};
