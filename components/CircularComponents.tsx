import Svg, {Circle} from 'react-native-svg';
import Animated, { useAnimatedProps, Easing, withTiming, useSharedValue, SlideInDown, SlideInUp, ZoomIn, ZoomOut, Layout, LinearTransition } from 'react-native-reanimated';
import { Text, ColorValue, Dimensions, Pressable, StyleSheet, View, useColorScheme } from 'react-native';
import { useEffect, useState } from 'react';
import { Session } from '@/constants/Types';
import { TimerText } from './TimerText';
import { Heading } from './StyledText';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Colors from '@/constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';

const {width, height} = Dimensions.get('window');
const ITEM_SIZE = width / 2.5;

interface CircularProgressProps {
    circleLength?: number,
    value: number
    fill?: ColorValue,
    background?: ColorValue,
    lineWidth?: number,
    backgroundWidth?: number,
    size?: number,
    // circleRadius?: number
}

interface CircularTimerProps extends CircularProgressProps {
    // timerCount: number,
    // duration: number,
    session: Session,
    setIsTimerOpen: Function
}

const animationDuration = 3000;

// export function CircularTimer({value, circleLength = 1000, timerCount, lineWidth = 30, backgroundWidth = 32.5, fill, background}: CircularTimerProps) {
export function CircularTimer({circleLength = 1000, setIsTimerOpen, session, lineWidth = 30, backgroundWidth = 32.5, fill, background, size = width}: CircularTimerProps) {
    const {title, numberOfSessions, lengthOfBreak, sessionDuration} = session;
    const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
    const [isTimerPaused, setIsTimerPaused] = useState<boolean>(false);
    const [timerCount, setTimerCount] = useState<number>(sessionDuration * 60 * 1000);
    const [breakCount, setBreakCount] = useState<number>(lengthOfBreak * 60 * 1000);
    const [currentSession, setCurrentSession] = useState<number>(1);
    const [timerId, setTimerId] = useState<NodeJS.Timeout | undefined>(undefined);
    const [animId, setAnimId] = useState<NodeJS.Timeout | undefined>(undefined);
    const [isBreak, setIsBreak] = useState<boolean | null>(null);
    const progress = useSharedValue(0);
    const timeInMs = sessionDuration * 60 * 1000
    const breakInMs = lengthOfBreak * 60 * 1000

    const AnimatedCircle = Animated.createAnimatedComponent(Circle);
    const circleRadius = circleLength/(2 * Math.PI);
    
    const colorScheme = useColorScheme();

    // const textEnteringAnim = (values: { targetOriginY: number; }) => {
    //     "worklet";
    //     const animations = {
    //       originY: withTiming(values.targetOriginY, {
    //         duration: 300,
    //         easing: Easing.elastic(1)
    //       }),
    //       // originY: withSpring(values.targetOriginY, {
    //       //   duration: 150,
    //       //   stiffness: 10,
    //       //   velocity: 0
    //       // }),
    //     };
    //     const initialValues = {
    //       originY: values.targetOriginY + 100,
    //     };
    //     return {
    //       initialValues,
    //       animations,
    //     };
    // };
    
    // const textExitingAnim = (values: { currentOriginY: any; }) => {
    //     "worklet";
    //     const animations = {
    //       originY: withTiming(values.currentOriginY - 100, {
    //         duration: 300,
    //         easing: Easing.elastic(1)
    //       }),
    //       // originY: withSpring(values.currentOriginY - 100, {
    //       //   duration: 150,
    //       //   stiffness: 10,
    //       //   velocity: 0
    //       // }),
    //     };
    //     const initialValues = {
    //       originY: values.currentOriginY,
    //     };
    //     return {
    //       initialValues,
    //       animations,
    //     };
    // };

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

    function getTime() {
      const timerDate = !isBreak ? new Date(timerCount) : new Date(breakCount);
      
      const minutes = timerDate.getMinutes().toString();
      const seconds = timerDate.getSeconds().toString().padStart(2, '0');
      return `${minutes}:${seconds}`;
    }

    function handleStartTimer() {
      setIsTimerPaused(false);
      // console.log({currentSession, msg: 'getting timer at start'})
      const newTimerId = setInterval(() => {
        // setTimerCount(prev => {
        //   let newValue = prev-1000;
        //   return newValue
        // });

        // if(timerCount > 0) {
        //   setTimerCount(prev => {
        //     let newValue = prev-1000;
        //     return newValue
        //   });
        //   console.log({timerCount, msg: 'here'})
        // }else {
        //   // setCurrentSession(prev => prev++)
        //   console.log('finished')
        //   clearTimeout(newTimerId)
        //   // handleStartBreakTimer();
        //   handleContinueTimer();
        // }
        
          setTimerCount(prev => {
            // let newValue = prev-1000;
            // return newValue
            let newValue = prev-1000;
            // console.log({prev})
            if(prev <= 0) {
              console.log('finished')
              clearTimeout(newTimerId);
              progress.value = 0;
              newValue = sessionDuration * 60 * 1000
              // handleStartBreakTimer();
              // handleContinueTimer(currentSession);
              setIsBreak(true)
            }
            return newValue
          });
          // console.log({timerCount, msg: 'here'})
          // setCurrentSession(prev => prev++)
      }, 1000)
      progress.value = withTiming(1, {duration: timerCount, easing: Easing.linear})
      // scrollX.value = 0;
      setAnimId(animId)
      setTimerId(newTimerId);
      setIsTimerRunning(true);
      setIsTimerPaused(false);
    }  

    useEffect(() => {
      if(isBreak === null) return;
      console.log({isBreak, currentSession, numberOfSessions})

      if(isBreak && currentSession === numberOfSessions) {
        // console.log('here in the use effect')
        // setIsBreak(null);
        handleStopTimer()
        return;
      }
      if(!isBreak) {
          handleStartTimer()
      }else {
          handleStartBreakTimer()
      }
      

      // if(currentSession < numberOfSessions+1) {
      //   if(!isBreak) {
      //     handleStartTimer()
      //   }else {
      //     handleStartBreakTimer()
      //   }
      // }else {
      //   handleStopTimer()
      // }
    }, [isBreak])

    // useEffect(() => {
    //   console.log({currentSession})
    // }, [currentSession])

    function handleStartBreakTimer() {
      setIsTimerPaused(false);
      const newTimerId = setInterval(() => {
        // setTimerCount(prev => {
        //   let newValue = prev-1000;
        //   return newValue
        // });
        // if(timerCount > 0) {
        //   setTimerCount(prev => {
        //     let newValue = prev-1000;
        //     return newValue
        //   });
        // }else {
        //   setCurrentSession(prev => prev++)
        //   clearTimeout(newTimerId)
        //   handleStartBreakTimer();
        // }
        setBreakCount(prev => {
          // let newValue = prev-1000;
          // return newValue
          let newValue = prev-1000;
          // console.log({prev})
          if(prev <= 0) {
            setCurrentSession(prev => prev+1)
            console.log('finished')
            clearTimeout(newTimerId);
            progress.value = 0;
            newValue = lengthOfBreak * 60 * 1000
            // handleStartBreakTimer();
            setIsBreak(false);
            // handleStartTimer();
            // setIsTimerRunning(true)
          }
          return newValue
        });
      }, 1000)
      // progress.value = withTiming(1, {duration: breakCount, easing: Easing.linear})
      progress.value = withTiming(1, {duration: breakCount, easing: Easing.linear})
      // scrollX.value = 0;
      setAnimId(animId)
      setTimerId(newTimerId);
      setIsTimerRunning(true);
      setIsTimerPaused(false);
    }

    // useEffect(() => {
    //   if(isTimerRunning) {

    //   }
    // }, [isTimerRunning])

    function handleContinueTimer(session: number) {
      // setCurrentSession(1000)
      console.log({session, currentSession, numberOfSessions, msg: 'continuing'})
      if(currentSession === numberOfSessions) {
        handleStopTimer()
      }else {
        setIsBreak(true);
        handleStartBreakTimer()
      }
    }
    // useEffect(() => {
    //   if(isBreak === true) {
    //     handleStartTimer()
    //   }
    // }, [isBreak])
    
    function handlePauseTimer() {
      if(timerId !== null) {
        clearTimeout(timerId);
        // const newProgress = parseFloat((((duration * 60 * 1000)-timerCount)/(duration * 60 * 1000)).toFixed(3))
        let newProgress;
        if(!isBreak) {
          // newProgress = parseFloat((((timeInMs * 60 * 1000)-timerCount)/(timeInMs * 60 * 1000)).toFixed(2));
          newProgress = ((timeInMs)-timerCount)/(timeInMs);
        }else {
          // newProgress = parseFloat((((breakInMs * 60 * 1000)-breakCount)/(breakInMs * 60 * 1000)).toFixed(2));
          newProgress = ((breakInMs)-breakCount)/(breakInMs);
        }
        // const newProgress = parseFloat((((timeInMs * 60 * 1000)-timerCount)/(timeInMs * 60 * 1000)).toFixed(2));
        console.log({newProgress, timerCount})
        // progress.value = newProgress;
        progress.value = parseFloat(newProgress.toFixed(3));
        console.log({value: progress.value})
        setIsTimerPaused(true);
      }
    }
    
    function handleStopTimer() {
      if(timerId !== null) { 
        clearTimeout(timerId);
        setTimerCount(session.sessionDuration * 60 * 1000)
        // setDuration(arr[0])
        // setTimerCount(duration * 60 * 1000);
        setIsBreak(null);
        setCurrentSession(1);
        progress.value = 0;
        setIsTimerRunning(false);
      }
      if(animId !== null) {
        clearTimeout(animId)
      }
    }

    // console.log({size})
    const animatedCircleProps = useAnimatedProps(() => ({
      // stroke: isBreak ? '#ff8473' : fill ?? 'rgba(0, 150, 0, 1)',
      // stroke: isBreak ? '#ff8473' : fill ? fill : 'rgba(0, 150, 0, 1)',
      strokeDashoffset: circleLength * progress.value,
    }))

    // const slideUpAnim = SlideInDown.easing(Easing.elastic()).duration(10000).withInitialValues({opacity: .5, borderRadius: 8, backgroundColor: 'red'})
    const slideDownAnim = SlideInUp.easing(Easing.elastic()).duration(500)
    const animationDuration = 500;
    const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

    const slideUpAnim = (values: { targetOriginY: number; }) => {
      "worklet";
      const animations = {
        originY: withTiming(values.targetOriginY, {
          duration: animationDuration,
          easing: Easing.elastic(0)
        }),
        borderRadius: withTiming(0, {duration: animationDuration}),
        // opacity: withTiming(1, {duration: animationDuration})
        // originY: withSpring(values.targetOriginY, {
        //   duration: 150,
        //   stiffness: 10,
        //   velocity: 0
        // }),
      };
      const initialValues = {
        originY: values.targetOriginY + height,
        borderRadius: 32,
        // opacity: .5
      };
      return {
        initialValues,
        animations,
      };
    };
    
    return (
        // <Animated.View 
        //   entering={slideUpAnim}
        <View 
          // exiting={slideDownAnim}
          // exiting={slideUpAnim}
          style={styles.timerComponent}
        >

          <View style={styles.timerTitleWrapper}>
            <Pressable style={styles.closeButton} onPress={() => setIsTimerOpen(false)}>
              {({ pressed }) => (
                // <FontAwesome
                //   name="info-circle"
                //   size={25}
                //   color={Colors[colorScheme ?? 'light'].text}
                //   // style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                //   style={{ opacity: pressed ? 0.5 : 1 }}
                // />
                <Ionicons 
                  name='arrow-back'
                  size={25}
                  color={Colors[colorScheme ?? 'light'].text}
                  style={{ transform: [{scale: pressed ? 0.8 : 1 }]}}
                />
              )}
            </Pressable>
            <Heading style={styles.timerTitle}>{title}</Heading>
          </View>
            
          <View style={styles.timerProgressWrapper}>
            <View style={styles.timerOverlaysWrapper}>
                <Animated.View style={styles.mainTimerOverlay}>
                  {/* <Animated.Text 
                      key={`0${getTime()[0]}`} 
                      entering={textEnteringAnim}
                      exiting={textExitingAnim}
                      style={styles.overlayText}
                  >
                      {getTime()[0]}
                  </Animated.Text> */}
                  <TimerText val={getTime()[0]} index={0} />

                  {getTime().length === 5 ?
                    // <Animated.Text
                    //   key={`1${getTime()[1]}`}
                    //   entering={textEnteringAnim}
                    //   exiting={textExitingAnim}
                    //   style={styles.overlayText}
                    // >
                    //   {getTime()[1]}
                    // </Animated.Text>

                    <TimerText val={getTime()[1]} index={1} />
                    : 
                    // <Animated.Text
                    //   // key={getTime()[1]}
                    //   entering={textEnteringAnim}
                    //   exiting={textExitingAnim}
                    //   style={styles.overlayText}
                    // >
                    //   :
                    // </Animated.Text>
                      <TimerText val={':'} index={1} />
                    }

                  {/* <Animated.Text
                      key={`2${getTime()[2]}`}
                      entering={textEnteringAnim}
                      exiting={textExitingAnim}
                      style={styles.overlayText}
                    >
                    {getTime()[2]}
                  </Animated.Text> */}
                  <TimerText val={getTime()[2]} index={2} />


                  {/* <Animated.Text
                    key={`3${getTime()[3]}`}
                    entering={textEnteringAnim}
                    exiting={textExitingAnim}
                    style={styles.overlayText}
                  >
                    {getTime()[3]}
                  </Animated.Text> */}
                  <TimerText val={getTime()[3]} index={3} />

                  {getTime().length === 5 ?
                  //   <Animated.Text
                  //   key={`4${getTime()[4]}`}
                  //   entering={textEnteringAnim}
                  //   exiting={textExitingAnim}
                  //   style={styles.overlayText}
                  // >
                  //   {getTime()[4]}
                  //   </Animated.Text>
                    <TimerText val={getTime()[4]} index={4} />
                  : null}

                </Animated.View>

                <Animated.View 
                  style={[styles.extraOverlayWrapper, {
                    transform: [
                      {
                        translateY: -75
                      }
                    ]
                  }
                ]}>
                  {/* <Text style={styles.extraOverlayText}>Session {currentSession} of {session.numberOfSessions}</Text> */}
                  {!isBreak ?
                    <Text style={styles.extraOverlayText}>Session {currentSession} of {session.numberOfSessions}</Text>
                  : <Text style={styles.extraOverlayText}>Break</Text>}
                </Animated.View>
            </View>
            <Svg 
                style={styles.svgWrapper} 
                width={size} 
                height={size}
                // height={size * 1.1}
                
              >

                <AnimatedCircle
                  cx={size/2}
                  cy={size/2}
                  // r={circleRadius > size ? size : circleRadius}
                  r={circleRadius} 

                  stroke={background ?? 'transparent'}
                  strokeWidth={backgroundWidth}
                  fill='transparent'
                  />
                <AnimatedCircle
                  // cx={width/2}
                  // cy={height/2.5} 

                  cx={size/2}
                  cy={size/2} 
                  // r={circleRadius > size ? size : circleRadius}
                  r={circleRadius}

                  fill='transparent'
                  // stroke={fill ?? 'rgba(0, 150, 0, 1)'}
                  stroke={isBreak ? '#ff8473' : fill ? fill : 'rgba(0, 150, 0, 1)'}
                  strokeWidth={lineWidth}
                  strokeDasharray={circleLength}
                  strokeLinecap={'round'}
                  transform={`rotate(-90, ${size/2}, ${size/2})`}
                  animatedProps={animatedCircleProps}
                />
            </Svg>
          </View>
          <View style={styles.timerButtonsWrapper}>
            {isTimerRunning ?
              <Pressable 
                // entering={ZoomIn}
                // exiting={ZoomOut}
                onPress={isTimerPaused ? () => handleStartTimer() : () => handlePauseTimer()} 
                style={styles.timerButton}
              >
                {({ pressed }) => (
                  <Text style={styles.timerButtonText}>
                    {isTimerPaused ? 'Resume' : 'Pause'}
                  </Text> 
                )} 
              </Pressable> 
            : null}
            <Pressable
              onPress={isTimerRunning ? () => handleStopTimer() : () => handleStartTimer()}
              style={[styles.timerButton, {backgroundColor: isTimerRunning ? 'red' : 'rgba(255, 255, 255, .25)'}]}
            >
              <Text style={styles.timerButtonText}>
                {isTimerRunning ? 'Reset' : 'Start'}
              </Text>
            </Pressable>
          </View>
        {/* </Animated.View> */}
        </View>
    )
}


export function CircularProgress({value, circleLength = 1000, lineWidth = 30, backgroundWidth = 32.5, fill, background, size = width}: CircularProgressProps) {
    const AnimatedCircle = Animated.createAnimatedComponent(Circle)
    const circleRadius = circleLength/(2 * Math.PI);
    
    const animatedCircleProps = useAnimatedProps(() => ({
        // strokeDashoffset: circleLength * value
        strokeDashoffset: circleLength * ((100-value) / 100)
        // strokeDashoffset: 100 * value
    }))
    return (
        // <Svg>
        //     <AnimatedCircle
        //       // cx={width/2}
        //       // cy={height/2.5}
        //       cx={size/2}
        //       cy={size/2.5}
        //       r={circleRadius}
        //       stroke={background ?? 'transparent'}
        //       strokeWidth={backgroundWidth}
        //       fill='transparent'
        //       />
        //     <AnimatedCircle
        //       // cx={width/2}
        //       // cy={height/2.5} 
        //       cx={size/2}
        //       cy={size/2.5} 
        //       r={circleRadius}
        //       fill='transparent'
        //       stroke={fill ?? 'rgba(0, 150, 0, 1)'}
        //       strokeWidth={lineWidth}
        //       strokeDasharray={circleLength}
        //       strokeLinecap={'round'}
        //       transform={`rotate(-90, ${width/2}, ${height/2.5})`}
        //       animatedProps={animatedCircleProps}
        //     />
        // </Svg>
        <View style={styles.timerProgressWrapper}>
          <Svg>
              <AnimatedCircle
                // cx={width/2}
                // cy={height/2.5}
                cx={size/2}
                cy={size/2}
                r={circleRadius}
                stroke={background ?? 'transparent'}
                strokeWidth={backgroundWidth}
                fill='transparent'
                />
              <AnimatedCircle
                // cx={width/2}
                // cy={height/2.5} 
                cx={size/2}
                cy={size/2} 
                r={circleRadius}
                fill='transparent'
                stroke={fill ?? 'rgba(0, 150, 0, 1)'}
                strokeWidth={lineWidth}
                strokeDasharray={circleLength}
                strokeLinecap={'round'}
                // transform={`rotate(-90, ${width/2}, ${height/2.5})`}
                // transform={`rotate(-90, ${size/2}, ${size/2.5})`}
                transform={`rotate(-90, ${size/2}, ${size/2})`}
                animatedProps={animatedCircleProps}
              />
          </Svg>
        </View>
    )
}

const styles = StyleSheet.create({
    timerComponent: {
      backgroundColor: 'black',
      flex: 1,
      width: width,
      alignItems: 'stretch',
      justifyContent: 'center',
      // overflow: 'hidden',

      // borderColor: 'red',
      // borderWidth: 1,
      // borderStyle: 'solid',
    },
    closeButton: {
      left: 32,
      // top: 4,
      // top: 32,
      padding: 8,
      borderRadius: 32,
      position: 'absolute',
      borderColor: 'white',
      borderWidth: 1,
      borderStyle: 'solid',
    },
    timerTitleWrapper: {
      position: 'relative',
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      // position: 'absolute',
      // top: 16,
      // borderColor: 'red',
      // borderWidth: 1,
      // borderStyle: 'solid',
    },
    timerTitle: {
      fontSize: 28,
      textAlign: 'center',
    },
    timerProgressWrapper: {
      width: '100%',
      // flex: 8,
      flex: 7,
      // alignItems: 'stretch',
      alignItems: 'center',
      justifyContent: 'center',
      // borderColor: 'blue',
      // borderWidth: 1,
      // borderStyle: 'solid',
    },
    timerOverlaysWrapper: {
      position: 'absolute',
      alignItems: 'center',
      justifyContent: 'center'
    },
    mainTimerOverlay: { 
      // width: ITEM_SIZE,
      height: ITEM_SIZE/1.5,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      // transform: [
      //   {
      //     translateY: -((ITEM_SIZE/1.5)/2)
      //   },
      //   {
      //     translateX: -(ITEM_SIZE/2)
      //   }
      // ],
      overflow: 'hidden',
      // borderColor: 'red',
      // borderWidth: 1,
      // borderStyle: 'solid',
    },
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
    extraOverlayWrapper: {
      position: 'absolute',
    },
    extraOverlayText: {
      color: 'grey',
      fontWeight: 'bold'
    },  
    svgWrapper: {
      // position: 'absolute' 
      // flex: 8,
      // height: 'auto',
      // alignItems: 'center',
      // justifyContent: 'center',
      borderColor: 'blue',
      borderWidth: 1,
      borderStyle: 'solid',
    },
    timerButtonsWrapper: { 
      // position: 'absolute',
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
      // bottom: 37.5,

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
      color: 'white',
      textAlign: 'center',
      fontWeight: '700'
    }
})