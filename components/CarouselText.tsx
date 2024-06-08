import Animated, { withTiming, Easing, SharedValue, interpolate, useAnimatedStyle, Extrapolation, useSharedValue, FadeOutUp, interpolateColor } from 'react-native-reanimated';
import { Text, useThemeColor, View } from './Themed';
import { Dimensions, StyleSheet, TextProps, useColorScheme, ViewProps } from 'react-native';
import Colors from '@/constants/Colors';

type CarouselTextProps = TextProps & {
    val: number,
    itemSize: number,
    index: number,
    scrollX: SharedValue<number> 
}

// const testWidth = width / 4;


export function CarouselText({val, scrollX, index, itemSize}: CarouselTextProps) {
    const inputRange = [
      (index-1) * itemSize,
      index * itemSize,
      (index+1) * itemSize,
    ]
    const colorScheme = useColorScheme() ?? 'dark';

    const textStyle = useAnimatedStyle(() => {
      return { 
        opacity: interpolate(scrollX.value, inputRange, [.4, 1, .4], 'clamp'),
        // color: interpolateColor(scrollX.value, inputRange, ['white', Colors[colorScheme].main, 'white']),
        // color: interpolateColor(scrollX.value, inputRange, ['white', 'rgba(0, 150, 0, 1)', 'white']),

        transform: [
          {
            scale: interpolate(scrollX.value, inputRange, [.65, 1, .65], 'clamp')
          },
          // {
          //   rotate: `${interpolate(scrollX.value, inputRange, [10, 0, -10], 'clamp')}deg`
          // },
          // {
          //   translateY: interpolate(scrollX.value, inputRange, [50, 0, 50], 'clamp')
          // }
        ]
      }
    })

    const viewStyle = useAnimatedStyle(() => {
      return {
        transform: [
          {
            translateX: itemSize * .75
          },
          // {
          //   rotateY: `${interpolate(scrollX.value, inputRange, [70, 0, -70], 'clamp')}deg`
          // },
          // {
          //   rotateZ: `${interpolate(scrollX.value, inputRange, [5, 0, -5], 'clamp')}deg`
          // }
        ]
      }
    })
    return (
        <Animated.View 
          style={[styles.carouselTextWrapper, {width: itemSize, height: itemSize}, viewStyle]}
        >
          <Animated.Text 
            style={[
              styles.carouselText, 
              textStyle
            ]} 
          >
              {val}
          </Animated.Text>
        </Animated.View>
    )
} 

const styles = StyleSheet.create({
    carouselTextWrapper: {
      // aspectRatio: 1,
      alignItems: 'center',
      justifyContent: 'center',
      // borderColor: 'red',
      // borderWidth: 1,
      // borderStyle: 'solid'
    },
    carouselText: {
        fontSize: 100,
        fontWeight: '500',
        fontVariant: ["tabular-nums"],
        textAlign: 'center',
        color: '#fff',
        // marginRight: screenWidth/2
        // fontSize: 64 - Math.abs(currentTimerVal-val)
        // borderColor: 'red',
        // borderWidth: 1,
        // borderStyle: 'solid'
      },
})