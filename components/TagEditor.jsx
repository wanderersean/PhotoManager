import { StyleSheet, View } from "react-native";
import Tags from "react-native-tags";

export default function TagEditor({ tags, setTags }) {
    return (
        <View style={styles.tagContainer}>
            <Tags
                key={JSON.stringify(tags || [])} // 强制重新挂载以显示新的tags
                initialText={''}
                textInputProps={{
                    placeholder: "自定义标签，空格或逗号结尾",
                    // 添加一些属性来改善键盘体验
                    blurOnSubmit: false,
                    returnKeyType: "done"
                }}
                createTagOnString={[",", "，", ' ', '\r\n']}
                initialTags={tags || []} // 确保tags始终是一个数组
                onChangeTags={(newTags) => {
                    setTags(newTags)
                }}
                containerStyle={{ justifyContent: "space" }}
                inputStyle={{ backgroundColor: "white", borderRadius: 10 }}
                // 当标签数量变化时，不自动失焦
                disableOnScroll={true}
                // 禁用有问题的标签渲染功能，使用默认渲染
                renderTag={undefined}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    tagContainer: {
        alignItems: 'center',
        minHeight: 60, // 确保有足够的空间显示标签
    },
});
