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
                initialTags={tags}
                onChangeTags={(tags) => {
                    setTags(tags)
                }}
                containerStyle={{justifyContent: "space"}}
                inputStyle={{backgroundColor: "white", borderRadius: 10}}

                // renderTag={({ tag, index, onPress, deleteTagOnPress, readonly }) => (
                //     <TouchableOpacity key={`${tag}-${index}`} onPress={onPress}>
                //         <Text>{tag}</Text>
                //     </TouchableOpacity>
                // )}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    tagContainer: {
        marginTop: 20,
        alignItems: 'center',
        paddingTop: 20,
    },
});