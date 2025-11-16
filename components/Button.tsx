import {StyleSheet, View, Pressable, Text} from "react-native";
import {useState} from "react";
import {FontAwesome} from "@expo/vector-icons";

export default function Button({label, onPress, enabled}: any) {
    const [buttonPressed, setButtonPressed] = useState(false)
    return (
        <View style={styles.buttonContainer}>
            <Pressable disabled={!enabled} style={[styles.button, buttonPressed && styles.buttonPressed]}
                       onPress={onPress}
                       onPressIn={() => {
                           setButtonPressed(true)
                       }}
                       onPressOut={() => {
                           setButtonPressed(false)
                       }}>
                <FontAwesome name={'cloud-upload'} style={styles.buttonIcon} size={28} color={'white'}></FontAwesome>
                <Text style={styles.buttonLabel}>{label}</Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    buttonContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        backgroundColor: 'blue',
        padding: 20,
        borderRadius: 10,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    buttonLabel: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center',
    },
    buttonIcon: {
        paddingRight: 20,
    },
    buttonPressed: {
        opacity: 0.5,
    },
    buttonDisabled: {},

});