import { StyleSheet } from "react-native";
import Animated, { Easing, withTiming } from "react-native-reanimated"

interface TimerTextProps {
    // enteringAnim?: EntryOrExitLayoutType,
    // exitingAnim?: EntryOrExitLayoutType
    val: string,
    index: number,
    // enteringAnim?: Function,
    // exitingAnim?: Function
}
const animationDuration = 300;

// export function TimerText({val, index, enteringAnim, exitingAnim}: TimerTextProps) {
export function TimerText({val, index}: TimerTextProps) {
    const textEnteringAnim = (values: { targetOriginY: number; }) => {
        "worklet";
        const animations = {
          originY: withTiming(values.targetOriginY, {
            duration: animationDuration,
            easing: Easing.elastic(1)
          }),
          opacity: withTiming(1, {
            duration: 100,
            // easing: Easing.elastic(1)
          }),
        };
        const initialValues = {
          originY: values.targetOriginY - 100,
          opacity: .5,
        };
        return {
          initialValues,
          animations,
        };
    };
    
    const textExitingAnim = (values: { currentOriginY: any; }) => {
        "worklet";
        const animations = {
          originY: withTiming(values.currentOriginY + 100, {
            duration: animationDuration,
            easing: Easing.elastic(1)
          }),
          // scaleZ: withTiming(.5, {
          //   duration: 100,
          //   easing: Easing.elastic(1)
          // })
        };
        const initialValues = {
          originY: values.currentOriginY,
          // scaleZ: 1,
        };
        return { 
          initialValues,
          animations,
        };
    };
    return (
        <Animated.View 
            key={`${index}${val}`}
            entering={textEnteringAnim}
            exiting={textExitingAnim}
            // style={{flex: 1}}
        >
            <Animated.Text
              style={styles.overlayText}
            >
              {val}
            </Animated.Text>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    overlayText: {
        fontSize: 80,
        fontWeight: '500',
        fontVariant: ["tabular-nums"],
        textAlign: 'center',
        color: '#fff',
        // borderColor: 'red',
        // borderWidth: 1,
        // borderStyle: 'solid'
      },
})