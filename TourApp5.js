import Tooltip from './Tooltip';

const ClickableObject = ({ position, onClick, tooltipText }) => {
    const [showTooltip, setShowTooltip] = useState(false);

    return (
        <View>
            <VrButton
                onEnter={() => setShowTooltip(true)}
                onExit={() => setShowTooltip(false)}
                onClick={onClick}
                style={{ position: 'absolute', left: position[0], top: position[1] }}
            >
                <Entity source={{ obj: asset('chair.obj'), mtl: asset('chair.mtl') }} />
            </VrButton>
            {showTooltip && <Tooltip text={tooltipText} position={[position[0] + 20, position[1] - 30]} />}
        </View>
    );
};
