import {View, StyleSheet} from "react-native";
import Tags from "react-native-tags";

export default function TagEditor({tags, setTags}) {
    return (
        <View style={styles.tagContainer}>
            <Tags
                initialText={''}
                textInputProps={{
                    placeholder: "自定义标签，空格或逗号结尾"
                }}
                createTagOnString={[",", "，", ' ', '\r\n']}
                initialTags={tags || []} // 确保tags始终是一个数组
                onChangeTags={(newTags) => {
                    setTags(newTags)
                }}
                containerStyle={{justifyContent: "space"}}
                inputStyle={{backgroundColor: "white", borderRadius: 10}}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    tagContainer: {
        alignItems: 'center',
    },
});