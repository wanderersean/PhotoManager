import { StyleSheet, View } from "react-native";
import * as Progress from 'react-native-progress';

export default function ProgressBar({ progress }) {
    // progress 是 0-100 的百分比,需要转换为 0-1 的小数
    const progressDecimal = progress / 100;

    return (
        <View style={styles.progressContainer}>
            <Progress.Bar width={null} progress={progressDecimal} />
        </View>
    )
}

const styles = StyleSheet.create({
    progressContainer: {
        width: '100%',
    },
});