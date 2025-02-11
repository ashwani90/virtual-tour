import InteractiveObject from './InteractiveObject';

const TourApp = () => {
    return (
        <View>
            <InteractiveObject objFile="chair.obj" mtlFile="chair.mtl" position={[100, 200]} />
            <InteractiveObject objFile="table.obj" mtlFile="table.mtl" position={[300, 400]} />
        </View>
    );
};
