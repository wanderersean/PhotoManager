import React, {useState, useRef} from "react";
import {View, StyleSheet, Text, Pressable, Animated} from "react-native";

export default function SubmitButton({enabled, onPress}) {
    const [isPressed, setIsPressed] = useState(false);
    const progressAnimation = useRef(new Animated.Value(0)).current;
    const pressTimer = useRef(null);

    const handlePressIn = () => {
        if (!enabled) return;
        
        setIsPressed(true);
        progressAnimation.setValue(0); // 确保从0开始
        
        // 开始动画，2秒内逐渐增加进度
        Animated.timing(progressAnimation, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: false,
        }).start();
        
        // 同时启动定时器检查完成状态
        const startTime = Date.now();
        const duration = 2000; // 2秒
        
        pressTimer.current = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // 如果达到100%，则触发上传
            if (progress >= 1) {
                clearInterval(pressTimer.current);
                onPress();
            }
        }, 16); // 约60fps
    };

    const handlePressOut = () => {
        if (!enabled) return;
        
        // 清除定时器
        if (pressTimer.current) {
            clearInterval(pressTimer.current);
            pressTimer.current = null;
        }
        
        // 停止动画并重置
        progressAnimation.stopAnimation();
        Animated.timing(progressAnimation, {
            toValue: 0,
            duration: 100,
            useNativeDriver: false,
        }).start();
        
        // 重置状态
        setIsPressed(false);
    };

    // 计算进度遮罩的样式 - 使用width属性更直观地控制进度
    const progressMaskStyle = {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: progressAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: ['0%', '100%'],
        }),
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        // 添加圆角以匹配按钮的圆角
        borderTopLeftRadius: 30,
        borderBottomLeftRadius: 30,
    };

    return (
        <View style={styles.container}>
            <Pressable 
                style={[styles.button, !enabled && styles.buttonDisabled]}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                disabled={!enabled}
            >
                {/* 进度遮罩层 */}
                {isPressed && (
                    <Animated.View style={[styles.progressMask, progressMaskStyle]} />
                )}
                <Text style={styles.buttonLabel}>长按上传</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        marginBottom: 0, // 去掉底部边距，贴牢底部
    },
    button: {
        backgroundColor: '#2196F3', // 修改为普通按钮颜色
        paddingVertical: 15,
        borderRadius: 30,
        borderWidth: 0, // 去掉边框宽度
        width: '100%',
        alignItems: 'center',
        // 添加overflow隐藏以确保遮罩不会超出边界
        overflow: 'hidden',
        position: 'relative',
    },
    buttonDisabled: {
        backgroundColor: '#cccccc',
    },
    progressMask: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        // 添加圆角以匹配按钮的圆角
        borderTopLeftRadius: 30,
        borderBottomLeftRadius: 30,
    },
    buttonLabel: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center',
        zIndex: 1,
    },
});