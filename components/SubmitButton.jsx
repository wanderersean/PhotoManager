import {View, StyleSheet} from "react-native";
import Button from "./Button";

export default function SubmitButton({enabled, onPress}) {
    return (
        <View style={styles.container}>
            <Button label={'点击上传'} enabled={enabled} onPress={onPress}> </Button>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#fff',
    },
});