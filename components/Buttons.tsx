import { ActivityIndicator, Pressable, PressableProps, StyleSheet } from "react-native";
import {Text} from './Themed';
import Animated from 'react-native-reanimated';

type TimerButtonProps = PressableProps & {
    callback: Function,
    args?: any[]
}

type CTAProps = PressableProps & {
    callback?: Function,
    loading?: boolean | null,
}

function useHandleCallback(callback?: Function, args?: any[]) {
    if(!callback) return;

    if(args) {
        callback(...args);
    }else {
        callback();
    }
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

export function CTA({callback, loading = null, children}: CTAProps) {
    return (
        <AnimatedPressable style={styles.ctaButton} onPress={() => useHandleCallback(callback)}>
            <>
                {loading === null ?
                    children
                : loading === true ?
                    <ActivityIndicator />
                : children}
            </>
        </AnimatedPressable>
    )
}

export function TimerButton({callback, args, children}: TimerButtonProps) {
    return (
        <Pressable 
            style={styles.button} 
            onPress={() => useHandleCallback(callback, args)}
        >
            {children}
        </Pressable>
    )
}

const styles = StyleSheet.create({
    ctaButton: {
        borderRadius: 8,
        paddingVertical: 16,
        paddingHorizontal: 24,
        backgroundColor: 'darkblue',
    },
    button: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 32,
        backgroundColor: '#00aaff',
    }
})