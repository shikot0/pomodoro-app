import { FlatList, Pressable, StyleSheet } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { View, Text } from "./Themed";
import { localSessionsStore } from "@/constants/globalState";
import { useState, useEffect } from "react";
import * as Haptics from 'expo-haptics';
import Animated, { interpolate, interpolateColor, runOnJS, SlideInLeft, SlideInRight, useAnimatedStyle, useSharedValue, Easing, withTiming, withSpring } from "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CTA } from "./Buttons";
import { Link } from "expo-router";
import Colors from "@/constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";

const animationTime = 1000

interface TimerListProps {
    callback?: Function
}

export default function TimerList({callback}: TimerListProps) {
    const [inEditMode, setInEditMode] = useState(false);
    const [started, setStarted] = useState(false);
    const {sessions, deleteSession} = localSessionsStore();
    const duration = useSharedValue(0);

    // useEffect(() => {
    //     while(started) {
    //         duration.value+
    //     }
    // }, [started])
    // const gesture = Gesture.LongPress()
    // .minDuration(100)
    // // .onBegin
    // .onStart((e) => {
    //     // console.log({e: e.})
    //     // duration.value = withTiming(animationTime)
    //     duration.value = withTiming(animationTime)
    //     // runOnJS(setInEditMode)(inEditMode ? false : true)
    //     // setInEditMode(true);
    // })
    // .onEnd(e => {
    //     if(duration.value === animationTime) {
    //         runOnJS(setInEditMode)(inEditMode ? false : true)
    //     }
    //     duration.value = withTiming(0);
    // })
    const gesture = Gesture.LongPress()
    .minDuration(500)
    .onBegin(e => {
        duration.value = withTiming(animationTime)
    })
    .onStart((e) => {
        // runOnJS(Haptics.selectionAsync)
        // runOnJS(Haptics.notificationAsync)(Haptics.NotificationFeedbackType.Success)
        runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Soft)
        // console.log({e: e.})
        // duration.value = withTiming(animationTime)
        // duration.value = withTiming(animationTime)
        // runOnJS(setInEditMode)(inEditMode ? false : true)
        // setInEditMode(true);
        if(duration.value === animationTime) {
            runOnJS(setInEditMode)(inEditMode ? false : true)
        }
        duration.value = withTiming(0);
    })
    // .onEnd(e => {
    //     if(duration.value === animationTime) {
    //         runOnJS(setInEditMode)(inEditMode ? false : true)
    //     }
    //     duration.value = withTiming(0);
    // })

    // useEffect(() => {
    //     console.log({inEditMode})
    // }, [inEditMode])

    const animatedStyle = useAnimatedStyle(() => {
        // const backgroundColor = interpolateColor(duration.value, [0, animationTime], [
        //     'darkblue',
        //     'red'
        // ])
        const scale = interpolate(duration.value, [0, animationTime], [1, .95], 'clamp')
        // const right = !inEditMode ? interpolate(duration.value, [0, animationTime], [0, 50]) : 0;
        // const width = !inEditMode ? interpolate(duration.value, [0, animationTime], [0, 50]) : 0;
        // const width = inEditMode ? 'auto' : '100%';
        // const width = interpolate(duration.value, [0, 500], [], 'clamp');

        // return {backgroundColor}
        // return {transform: [{scale}]}
        // return {transform: [{scale}]}
        return {}
    })

    async function handleDeleteSession(id: string) {
        deleteSession(id)
        await AsyncStorage.setItem('sessions', JSON.stringify(sessions))
    }

    function handleUseCallback(callback?: Function, params?: any[]) {
        if(!callback) return;
        if(callback && params) {
            callback(...params)
        }else callback();
    }

    const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

    return (
        <GestureDetector gesture={gesture}>             
            {/* <FlatList
                style={styles.savedSessionsWrapper}
                contentContainerStyle={{alignItems: 'stretch'}}
                data={sessions}
                renderItem={({item, index}) => {
                    return (
                        <View style={styles.savedSessionWrapper}>
                            <AnimatedPressable onPress={() => handleUseCallback(callback, [item])} style={[styles.savedSession, animatedStyle]}>
                              <Text>{item.title}</Text>
                              <Text>{item.numberOfSessions}x{item.sessionDuration}{item.sessionDuration === 1 ? 'min' : 'mins'}, {item.lengthOfBreak}min break</Text>
                            </AnimatedPressable>
                            {inEditMode ? 
                                <AnimatedPressable 
                                    onPress={() => handleDeleteSession(item.id)} 
                                    style={styles.sessionDeleteButton}
                                    entering={SlideInRight.easing(Easing.elastic(.75)).duration(500)}
                                >
                                  <Text>Delete</Text>
                                </AnimatedPressable>
                            : null}
                        </View>
                    )
                }}
            /> */}
            <View style={styles.timerListWrapper}>
                <Pressable style={styles.addNewTimerButton}>
                    {/* <Text>Add a new Timer</Text> */}
                    <Link href={'../newTimerPage'}>
                        {/* <Text>Add a new Timer</Text> */}
                        <Ionicons name="add" color={'white'} size={48} />
                    </Link>
                </Pressable>
                <FlatList
                    style={styles.savedSessionsWrapper}
                    contentContainerStyle={{alignItems: 'stretch'}}
                    data={sessions}
                    renderItem={({item, index}) => {
                        return (
                            <View style={styles.savedSessionWrapper}>
                                <AnimatedPressable onPress={() => handleUseCallback(callback, [item])} style={[styles.savedSession, animatedStyle]}>
                                  <Text>{item.title}</Text>
                                  <Text>{item.numberOfSessions}x{item.sessionDuration}{item.sessionDuration === 1 ? 'min' : 'mins'}, {item.lengthOfBreak}min break</Text>
                                </AnimatedPressable>
                                {inEditMode ? 
                                    <AnimatedPressable 
                                        onPress={() => handleDeleteSession(item.id)} 
                                        style={styles.sessionDeleteButton}
                                        entering={SlideInRight.easing(Easing.elastic(.75)).duration(500)}
                                    >
                                      <Text>Delete</Text>
                                    </AnimatedPressable>
                                : null}
                            </View>
                        )
                    }}
                />
            </View>
        </GestureDetector>
    )
}

const styles = StyleSheet.create({
    timerListWrapper: {
        flex: 1,
        gap: 32,
    },
    addNewTimerButton: {
        borderRadius: 50,
        backgroundColor: 'darkblue',
        padding: 16,
        alignSelf: 'center'
    },
    savedSessionsWrapper: {
        paddingHorizontal: 16,
        // borderColor: 'red',
        // borderWidth: 1,
        // borderStyle: 'solid',
    },
    savedSessionWrapper: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
        gap: 16,
        // borderColor: 'red',
        // borderWidth: 1,
        // borderStyle: 'solid',
    },
    savedSession: {
        display: 'flex',
        position: 'relative',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        flex: 1,
        justifyContent: 'space-between',
        overflow: 'hidden',
        // width: '100%',
        padding: 16,
        borderRadius: 8,
        backgroundColor: 'darkblue',
    },
    sessionDeleteButton: {
        // flex: 1,
        // position: 'absolute',
        // left: 0,
        // top: 0,
        // right: 0,
        borderRadius: 8,
        padding: 16,
        // height: '100%',
        // width: '100%',
        // alignSelf: 'stretch',
        // alignSelf: 'stretch',
        backgroundColor: 'rgba(255, 0, 0, .75)',
    }
})