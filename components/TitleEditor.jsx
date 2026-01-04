import { StyleSheet, View } from "react-native";
import { TextInput } from 'react-native-paper';

export default function TitleEditor({ title, onSave }) {

    return (
        <View style={styles.titleContainer}>
            <TextInput
                label={''}
                mode={'outlined'}
                placeholder={'请输入标题'}
                onChangeText={(text) => {
                    onSave(text)
                }}
                value={title}
                style={styles.textInput}
                left={<TextInput.Icon icon="pencil" />} // 添加前置图标
                right={title ? // 只有当有标题内容时才显示清除按钮
                    <TextInput.Icon
                        icon="close"
                        onPress={() => onSave('')} // 清除标题
                    /> : null
                }
                // 添加键盘相关属性
                blurOnSubmit={true}
                returnKeyType="done"
            />
        </View>
    )
}

const styles = StyleSheet.create({
    titleContainer: {
        width: '100%',
        marginBottom: 10,
    },
    textInput: {
        height: 30, // 缩短高度从40到30
        fontSize: 14,
    }
})