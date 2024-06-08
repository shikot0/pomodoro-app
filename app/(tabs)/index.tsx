import { Dimensions, FlatList, Pressable, StyleSheet, TextInput, useAnimatedValue } from 'react-native';

import { Text, useThemeColor, View } from '@/components/Themed';
import { useEffect, useRef, useState } from 'react';
import { TimerButton } from '@/components/Buttons';
import { StatusBar as StatusBarObject } from 'react-native';
import Animated, {Easing, Extrapolation, interpolate, SlideOutUp, runOnJS, useAnimatedScrollHandler, useAnimatedStyle, useEvent, useSharedValue, withSpring, withTiming, SlideInDown, SlideInUp, FadeInUp, FadeOutDown, FadeOutUp, useAnimatedProps, useDerivedValue} from 'react-native-reanimated';
import { Gesture } from 'react-native-gesture-handler';
import Colors from '@/constants/Colors';
import Svg, {Circle, Text as SVGText} from 'react-native-svg';
import { rgbaArrayToRGBAColor } from 'react-native-reanimated/lib/typescript/reanimated2/Colors';
import { StatusBar } from 'expo-status-bar';
import { Carousel } from '@/components/Carousel';
import {CircularProgress, CircularTimer} from '@/components/CircularComponents';
import { localSessionsStore, localSettingsStore } from '@/constants/globalState';
import { Heading } from '@/components/StyledText';
import TimerList from '@/components/TimerList';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Session } from '@/constants/Types';


const {width, height} = Dimensions.get('window');
const ITEM_SIZE = width / 2.5;
const ITEM_SPACING = (width-ITEM_SIZE)/2;
const CIRCLE_LENGTH = 1000;
const CIRCLE_RADIUS = CIRCLE_LENGTH/(2 * Math.PI);

export default function Timer() {
  // const arr = populateArr(60);
  const statusBarHeight = StatusBarObject.currentHeight
  const {settings} = localSettingsStore();
  const {appTheme, timerSliderWidth} = settings;
  const arr = [1, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60];
  const [duration, setDuration] = useState(arr[0]);
  const [currentTimer, setCurrentTimer] = useState<Session | null>(null);
  const [timerCount, setTimerCount] = useState<number>(duration * 60 * 1000);
  const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null);
  const [animId, setAnimId] = useState<NodeJS.Timeout | null>(null);
  const [isTimerOpen, setIsTimerOpen] = useState(false);
  const progress = useSharedValue(0);
  const scrollX = useSharedValue(0);
  const testSession = {id: 'testid', lengthOfBreak: .1, sessionDuration: .1, numberOfSessions: 2, title: 'testSesssion'}

  // console.log({sessions})


  const bounceInAnim = FadeInUp
  .duration(450)
  .easing(Easing.elastic(3))
  .withInitialValues({opacity: 0, transform: [{translateY: -50}]})

  const fadeInAnim = FadeInUp
  .duration(450)

  const fadeOutAnim = FadeOutUp
  .duration(450)
  .easing(Easing.elastic())

  useEffect(() => {
    setTimerCount(duration * 60 * 1000)
  }, [duration])

  // useEffect(() => {
  //   progress.value = (timerCount/(duration * 60 * 1000)) * 100;
  //   console.log({progress: progress.value})
  // }, [timerCount])
  
  function populateArr(size: number, start: number = 1) {
    let arr = [];
    for(let i = start; i < start+size; i++) {
      arr.push(i);
    }
    return arr;
  }
 
  // useEffect(() => {
  //   AsyncStorage.removeItem('sessions')
  // }, [])

  function handleSetCurrentTimer(session: Session) {
    setCurrentTimer(session)
  }

  useEffect(() => {
    if(currentTimer) {
      setIsTimerOpen(true)
    }
  }, [currentTimer])

  useEffect(() => {
    if(!isTimerOpen) {
      setCurrentTimer(null)
    }
  }, [isTimerOpen])

  return (
    <View style={[styles.container, {paddingTop: statusBarHeight}]}>
      {/* <GestureDetector gesture={panGesture}> */}
        {!isTimerOpen ?
          <Animated.View 
            style={styles.pomodoroHeadingWrapper}
            exiting={fadeOutAnim}
            entering={fadeInAnim}
          >
            <Heading style={styles.pomodoroHeading}>Select a timer</Heading>
          </Animated.View>
        : null}

        {/* <CircularTimer setIsTimerOpen={setIsTimerOpen} session={testSession} value={progress.value} /> */}

        {currentTimer && isTimerOpen ? 
            <CircularTimer setIsTimerOpen={setIsTimerOpen} fill={appTheme} lineWidth={timerSliderWidth} session={currentTimer} value={progress.value} />
        : <TimerList callback={handleSetCurrentTimer}/>}
      {/* <StatusBar hidden={false} backgroundColor='black'/> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 48,
  },
  pomodoroHeadingWrapper: {
    // position: 'absolute',
    width: width,
    // top: 50,
    // flex: 1,
    padding: 16,
    // marginBottom: 50,
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 32,
    // borderWidth: 1,
    // borderStyle: 'solid',
    // borderColor: 'red'
  },
  pomodoroHeading: {
    fontSize: 32,
    textAlign: 'center'
  },
  timerSection: {
    position: 'relative',
    // position: 'absolute',
    // height: height,
    // width: width,
    flex: 8,
    // alignItems: 'center',
    // justifyContent: 'center',
    // borderWidth: 1,
    // borderStyle: 'solid',
    // borderColor: 'red'
  },
  savedSessionsWrapper: {
    // alignItems: 'stretch',
    // gap: 100,
    paddingHorizontal: 16,
  },
  savedSession: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: 'darkblue',
  },
  timerButtonsWrapper: { 
    position: 'absolute',
    flex: 2,
    width: width,
    // transform: [
    //   {
    //     translateY: -37.5
    //   }
    // ],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    bottom: 37.5,
    // borderColor: 'red',
    // borderStyle: 'solid',
    // borderWidth: 1,
  },
  timerButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, .25)',
    alignItems: 'center',
    justifyContent: 'center',
    // borderColor: 'red',
    // borderStyle: 'solid',
    // borderWidth: 1
  },
  timerButtonText: {
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 700
  },
  // timerWrapper: {
  //   position: 'absolute',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   width: 150,
  //   height: 150,
  //   overflow: 'hidden',
  //   backgroundColor: 'rgba(255,255,255, .5)',
  //   borderRadius: 16
  // },
  animatedView: {
    paddingHorizontal: ITEM_SIZE,
    flexDirection: 'row'
  },
  timer: {
    fontSize: 64,
    fontWeight: '500',
    fontVariant: ["tabular-nums"],
    textAlign: 'center',
    color: '#00ff00',
    // borderColor: 'red',
    // borderWidth: 1,
    // borderStyle: 'solid'
  },
  buttonsSection: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 32,
    borderColor: 'red',
    borderWidth: 1,
    borderStyle: 'solid',
  },
  timerTextWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    // borderColor: 'red',
    // borderWidth: 1,
    // borderStyle: 'solid'
  },
  timerText: {
      fontSize: 128,
      fontWeight: '500',
      fontVariant: ["tabular-nums"],
      textAlign: 'center',
      color: '#00ff00',
      // marginRight: screenWidth/2
      // fontSize: 64 - Math.abs(currentTimerVal-val)
      // borderColor: 'red',
      // borderWidth: 1,
      // borderStyle: 'solid'
    },
});
