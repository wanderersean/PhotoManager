import { useShareIntentContext } from "expo-share-intent";
import { useEffect, useState } from "react";

export default function useIntentFiles() {
    const { hasShareIntent, shareIntent } = useShareIntentContext();
    const [imageFiles, setImageFiles] = useState([])

    useEffect(() => {
        if (hasShareIntent && shareIntent?.files) {
            // Convert share intent files to the format expected by upload
            const files = shareIntent.files.map(item => ({
                uri: item.path,
                fileName: item.fileName || item.path.split('/').pop() || 'shared_image.jpg',
                mimeType: item.mimeType || 'image/jpeg'
            }));
            setImageFiles(files);
        } else {
            setImageFiles([]);
        }
    }, [hasShareIntent, shareIntent]);

    return imageFiles;
}