import React, {useState, useRef} from "react";
import {View, StyleSheet, Text, Pressable, ActivityIndicator} from "react-native";

export default function SubmitButton({enabled, onPress}) {
    const [progress, setProgress] = useState(0);
    const [isPressed, setIsPressed] = useState(false);
    const pressTimer = useRef(null);

    const handlePressIn = () => {
        if (!enabled) return;
        
        setIsPressed(true);
        setProgress(0);
        
        // 开始计时器，2秒内逐渐增加进度
        const startTime = Date.now();
        const duration = 2000; // 2秒
        
        pressTimer.current = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const newProgress = Math.min(elapsed / duration, 1);
            
            setProgress(newProgress);
            
            // 如果达到100%，则触发上传
            if (newProgress >= 1) {
                clearInterval(pressTimer.current);
                onPress();
                setProgress(0);
                setIsPressed(false);
            }
        }, 16); // 约60fps
    };

    const handlePressOut = () => {
        if (!enabled) return;
        
        // 清除计时器
        if (pressTimer.current) {
            clearInterval(pressTimer.current);
            pressTimer.current = null;
        }
        
        // 重置状态
        setProgress(0);
        setIsPressed(false);
    };

    return (
        <View style={styles.container}>
            <Pressable 
                style={[styles.button, !enabled && styles.buttonDisabled, isPressed && styles.buttonPressed]}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                disabled={!enabled}
            >
                <View style={styles.contentContainer}>
                    {/* 使用ActivityIndicator替代Progress.Circle */}
                    {isPressed ? (
                        <ActivityIndicator 
                            size="small" 
                            color="white" 
                            style={styles.activityIndicator}
                        />
                    ) : null}
                    <Text style={styles.buttonLabel}>长按上传</Text>
                </View>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#fff',
    },
    button: {
        backgroundColor: 'blue',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 30,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonPressed: {
        backgroundColor: '#0000cc', // 按下时更深的蓝色
    },
    buttonDisabled: {
        backgroundColor: '#cccccc', // 禁用时的灰色
    },
    contentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    activityIndicator: {
        marginRight: 10,
    },
    buttonLabel: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center',
    },
});