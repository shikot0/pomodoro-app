import { Carousel } from "@/components/Carousel";
import { Text, ScrollView } from "@/components/Themed";
import { useEffect, useState } from "react";
import { View, Dimensions, NativeSyntheticEvent, Pressable, StyleSheet, TextInput, TextInputTextInputEventData } from "react-native";
import { localSessionsStore } from "@/constants/globalState";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CarouselInput, CustomNumberInput, CustomTextInput } from "@/components/Inputs";
import { Heading } from "@/components/StyledText";
import { StatusBar } from "expo-status-bar";
// import {v4} from 'uuid';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs'
import Colors from "@/constants/Colors";
import { CTA } from "@/components/Buttons";


interface Session {
    id: string,
    title: string,
    lengthOfBreak: number | null,
    sessionDuration: number | null,
    numberOfSessions: number | null,
}

const {width, height} = Dimensions.get('window');
const HORIZONTAL_PAGE_PADDING = 16;
const ITEM_SIZE = (width-(HORIZONTAL_PAGE_PADDING*2)) / 2.5

export default function NewTimerPage() {
    // const tabBarHeight = useBottomTabBarHeight();
    // console.log({tabBarHeight})

    const [newSession, setNewSession] = useState<Session>({
        id: generateId(),
        title: '',
        sessionDuration: null,
        lengthOfBreak: null,
        numberOfSessions: null,
    });
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [sessionDuration, setSessionDuration] = useState(null)
    const [lengthOfBreak, setLengthOfBreak] = useState(null);
    const {sessions, addNewSession} = localSessionsStore();
    const options = [1, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60];

    function generateId(length: number = 20) {
        let id = '';
        const chars = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '1', '2', '3', '4', '5', '6', '7', '8', '9']
        for(let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * chars.length-1);
            // console.log({randomIndex})
            id += `${chars[randomIndex]}`
        }
        // console.log({id})
        return id;
    }

    // console.log({sessions})

    useEffect(() => {
        setNewSession(prev => {
            return {...prev, sessionDuration}
        })
    }, [sessionDuration])

    useEffect(() => {
        setNewSession(prev => {
            return {...prev, lengthOfBreak}
        })
    }, [lengthOfBreak])

    useEffect(() => {
        console.log({newSession})
    }, [newSession])

    function handleTextInput(e: NativeSyntheticEvent<TextInputTextInputEventData>) {
        e.persist() 
        const text = e.nativeEvent.text;
        // console.log({event: e.nativeEvent})
        if(text) {
            setNewSession((prev) => {
                return {...prev, title: e.nativeEvent.text}
            })
        }
        // console.log({target: e.nativeEvent.text})
    }
    
    function handleSessionNumInput(e: NativeSyntheticEvent<TextInputTextInputEventData>) {
        e.persist() 
        const num = parseInt(e.nativeEvent.text);
        // console.log({event: e.nativeEvent})
        if(num) {
            setNewSession((prev) => {
                return {...prev, numberOfSessions: num}
            })
        }
    }

    async function handleSaveSession() {
        setIsLoading(true)
        addNewSession(newSession);
        console.log({sessions});
        await AsyncStorage.setItem('sessions', JSON.stringify(sessions));
        setNewSession(() => {
            return {
                id: generateId(),
                title: '',
                sessionDuration: null,
                lengthOfBreak: null,
                numberOfSessions: null,
            }
        });
        setIsLoading(false)
    }

    return (
        
        // <View style={[styles.container, {paddingBottom: tabBarHeight}]}>
        // <View style={styles.container}>
        //     {/* <View style={styles.inputWrapper}>
        //         <TextInput
        //             style={styles.textInput}
        //             // caretHidden={true} 
        //             cursorColor={'white'}                    
        //             onTextInput={e => handleTextInput(e)}
        //             defaultValue={newSession.title}
        //         /> 
        //         <Text style={styles.inputHeading}>Session Title</Text>
        //     </View> */} 
        //     <Heading>Create a New Session</Heading>

        //     <CustomTextInput setter={setNewSession} val="title" title={"Session Title"}/>
        //     <CustomNumberInput setter={setNewSession} val="numberOfSessions" title={"Number of Sessions"}/>
        //     <CarouselInput values={options} title="Work Duration" setter={setSessionDuration}/>
        //     <CarouselInput values={options} title="Break Duration" setter={setLengthOfBreak}/>
        //     <View style={styles.buttonsWrapper}>
        //         <Pressable style={styles.ctaButton} onPress={() => handleSaveSession()}>
        //             <Text>Save</Text>
        //         </Pressable>
        //     </View>
        //     <StatusBar hidden={false} />
        // </View>

        // <View style={styles.container}>
            <ScrollView 
                style={styles.formWrapper} 
                // contentContainerStyle={{gap: 50, paddingHorizontal: HORIZONTAL_PAGE_PADDING, paddingTop: 48, paddingBottom: tabBarHeight}}
                // contentContainerStyle={{gap: 50, paddingHorizontal: HORIZONTAL_PAGE_PADDING, paddingTop: 48}}
                // contentContainerStyle={{gap: 50, paddingHorizontal: HORIZONTAL_PAGE_PADDING, paddingTop: 24}}
                contentContainerStyle={{gap: 50, paddingHorizontal: HORIZONTAL_PAGE_PADDING, paddingVertical: 24}}
                // StickyHeaderComponent={() => <Heading>Create a New Session</Heading>}
                // stickyHeaderIndices={[0]}
            >
                {/* <View style={styles.inputWrapper}>
                    <TextInput
                        style={styles.textInput}
                        // caretHidden={true} 
                        cursorColor={'white'}                    
                        onTextInput={e => handleTextInput(e)}
                        defaultValue={newSession.title}
                    /> 
                    <Text style={styles.inputHeading}>Session Title</Text>
                </View> */} 
                <Heading>Create a New Timer</Heading>

                <CustomTextInput setter={setNewSession} val="title" placeholder="Study session" title={"Session Title"}/>
                <CustomNumberInput setter={setNewSession} val="numberOfSessions" title={"Number of Sessions"}/>
                <CarouselInput itemSize={ITEM_SIZE} values={options} title="Work Duration (in mins)" setter={setSessionDuration}/>
                <CarouselInput itemSize={ITEM_SIZE} values={options} title="Break Duration (in mins)" setter={setLengthOfBreak}/>
                <View style={styles.buttonsWrapper}>
                    {/* <Pressable style={styles.ctaButton} onPress={() => handleSaveSession()}>
                        <Text>Save</Text>
                    </Pressable> */}
                    <CTA callback={handleSaveSession} loading={isLoading}>
                        <Text>Save</Text>
                    </CTA>
                </View>
                {/* <StatusBar hidden={false} backgroundColor="red" /> */}
            </ScrollView>
        // </View> 
    )
}

const styles = StyleSheet.create({
    // container: {
    //     flex: 1,
    //     // minHeight: '100%',
    //     // overflow: 'scroll',
    //     // // justifyContent: 'space-between',
    //     // // rowGap: 100,
    //     // // paddingVertical: 24,
    //     // gap: 48,
    //     // paddingTop: 48,
    //     // paddingHorizontal: 16,
    //     borderWidth: 1,
    //     borderStyle: 'solid',
    //     borderColor: 'red',
    // },
    formWrapper: {
        // gap: 48,
        
        // flex: 1,
        // borderWidth: 1,
        // borderColor: 'red',
        // borderStyle: 'solid',
    },
    buttonsWrapper: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    // ctaButton: {
    //     borderRadius: 8,
    //     paddingVertical: 16,
    //     paddingHorizontal: 24,
    //     backgroundColor: 'darkblue',
    // }
})