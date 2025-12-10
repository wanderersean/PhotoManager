import { View, StyleSheet} from "react-native";
import { TextInput } from 'react-native-paper';

export default function TitleEditor({title, onSave}) {

    return (
        <View style={styles.titleContainer}>
            <TextInput
                label={'标题'}
                mode={'outlined'}
                placeholder={'请输入标题'}
                onChangeText={(text) =>{
                    onSave(text)
                }}
                value={title}
                style={styles.textInput} // 添加样式属性
            />
        </View>
    )
}

const styles = StyleSheet.create({
    titleContainer: {
        width: '100%',
        backgroundColor: 'white',
        opacity: 0.7,
        borderRadius: 10,
    },
    textInput: {
        height: 40, // 设置较小的高度
        fontSize: 14, // 设置较小的字体大小
    }
})