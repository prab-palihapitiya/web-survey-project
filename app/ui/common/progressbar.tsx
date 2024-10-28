import { ProgressProps } from "@/app/lib/config/template-config";
import { DefaultMantineColor, Progress, RingProgress, SemiCircleProgress, Text } from "@mantine/core";

const ProgressBar = ({ props, value }: { props: ProgressProps, value: number }) => {
    const getProgressBar = () => {
        switch (props?.type || 'bar') {
            case 'bar':
                return <Progress
                    color={props.color as DefaultMantineColor}
                    value={value}
                    w={props.barLength}
                    radius={props.radius} size={props.size}
                    animated={value < 100 ? props.animated : false}
                    mt={0} mr={8} />;

            case 'ring':
                return <RingProgress
                    sections={[{ value: value, color: props.color as DefaultMantineColor }]}
                    label={
                        <Text c={props.labelColor} fw={500} ta="center" size="sm">
                            {value}%
                        </Text>
                    }
                    thickness={props.circleThickness}
                    size={props.circleSize} mt={0} mr={8} />;

            case 'semi-circle':
                return <SemiCircleProgress
                    value={value}
                    label={
                        <Text c={props.labelColor} fw={500} ta="center" size="sm">
                            {value}%
                        </Text>
                    }
                    labelPosition="center"
                    size={props.circleSize}
                    thickness={props.circleThickness}
                    emptySegmentColor={props.emptySegmentColor}
                />;

            default:
                return <Progress
                    color={props.color as DefaultMantineColor}
                    value={value}
                    w={props.barLength}
                    radius={props.radius}
                    size={props.size}
                    mt={0} mr={8} />;
        }
    };

    return (
        getProgressBar()
    );
}

export default ProgressBar;