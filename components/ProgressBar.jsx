import {View, StyleSheet} from "react-native";
import * as Progress from 'react-native-progress'

export default function ProgressBar({progress}) {
    return (
        <View style={styles.progressContainer}>
            <Progress.Bar width={null} progress={progress}/>
        </View>
    )
}

const styles = StyleSheet.create({
    progressContainer: {
        width: '100%',
        display: 'none'
    },
});