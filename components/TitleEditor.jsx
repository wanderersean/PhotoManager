import {TextInput, View, StyleSheet} from "react-native";

export default function TitleEditor({title, onSave}) {

    return (
        <View style={styles.titleContainer}>
            <TextInput
                placeholder="(可选）请输入标题"
                placeholderTextColor="black"
                onChangeText={(text) => {
                    onSave(text)
                }}
                value={title}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    titleContainer: {
        width: '100%',
        backgroundColor: 'white',
        opacity: 0.7,
        padding: 10,
        borderRadius: 10,
    }
})