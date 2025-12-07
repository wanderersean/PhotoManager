import {useEffect, useState} from "react";
import {useShareIntentContext} from "expo-share-intent";

export default function useIntentFiles() {
    const {hasShareIntent, shareIntent} = useShareIntentContext();
    const [imagePaths, setImagePaths] = useState([])

    useEffect(() => {
        if (hasShareIntent) {
            let filePaths = shareIntent.files.map(item => item.path)
            setImagePaths(filePaths)
        }
    }, [hasShareIntent, shareIntent]);

    return imagePaths
}