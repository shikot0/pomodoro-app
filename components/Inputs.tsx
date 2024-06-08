import { TextInput, StyleSheet, View, NativeSyntheticEvent, TextInputTextInputEventData } from "react-native"
import { Text } from "./Themed"
import { Carousel } from "./Carousel";


interface TextInputProps {
    setter: Function,
    val: string,
    defaultValue?: string,
    placeholder?: string,
    title?: string,
}

interface CarouselInputProps {
    values: string[] | number[],
    itemSize?: number,
    setter: Function,
    title?: string
}


export function CustomTextInput({setter, val, defaultValue = '', placeholder, title}: TextInputProps) {
    // function handleTextInput(e: NativeSyntheticEvent<TextInputTextInputEventData>) {
    //     e.persist() 
    //     const text = e.nativeEvent.text;
    //     if(text) {
    //         setter((prev: any) => {
    //             return {...prev, [val]: text}
    //         })
    //     }
    // }

    function handleTextInput(text: string) {
        if(text) {
            setter((prev: any) => {
                return {...prev, [val]: text}
            })
        }
    }
    return (
        <View style={styles.inputWrapper}>
            <TextInput
                style={styles.textInput}
                // caretHidden={true}
                // placeholder={title}
                placeholderTextColor={'rgba(255, 255, 255, .5)'}
                cursorColor={'white'}  
                onChangeText={text => handleTextInput(text)}                  
                // onTextInput={e => handleTextInput(e)}
                placeholder={placeholder}
                defaultValue={defaultValue}
            />
            <Text style={styles.inputHeading}>{title ?? val}</Text>
        </View>
    )
}
export function CustomNumberInput({setter, val, defaultValue = '', title}: TextInputProps) {
    // function handleTextInput(e: NativeSyntheticEvent<TextInputTextInputEventData>) {
    //     e.persist() 
    //     const text = e.nativeEvent.text;
    //     if(text) {
    //         setter((prev: any) => {
    //             return {...prev, [val]: e.nativeEvent.text}
    //         })
    //     }
    // }
    function handleNumberInput(text: string) {
        if(text) {
            setter((prev: any) => {
                return {...prev, [val]: text}
            })
        }
    }
    return (
        <View style={styles.inputWrapper}>
            <TextInput
                style={styles.textInput}
                // caretHidden={true}
                keyboardType="numeric"
                cursorColor={'white'} 
                onChangeText={number => handleNumberInput(number)}                   
                // onTextInput={e => handleTextInput(e)}
                defaultValue={defaultValue}
            />
            <Text style={styles.inputHeading}>{title ?? val}</Text>
        </View>
    )
}

export function CarouselInput({values, itemSize, setter, title}: CarouselInputProps) {
    return (
        <View style={styles.carouselInputWrapper}>
            <Carousel data={values} itemSize={itemSize} setter={setter} />
            <Text style={styles.carouselInputHeading}>{title ?? 'Carousel input'}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    inputWrapper: {
        display: 'flex',
        justifyContent: 'center',
        paddingTop: 8,
    },
    textInput: {
        fontSize: 24, 
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        backgroundColor: 'rgba(255, 255, 255, .25)',
        color: 'white',
        fontFamily: 'Alata'
        // color: 'red'
    },
    inputHeading: {
        // fontFamily: 'Alata',
        fontFamily: 'Jakarta',
        fontSize: 12,
        // fontWeight: '100', 
        position: 'absolute',
        left: 0,
        top: 0,
        // transform: [
        //     {
        //         translateY: -20,
        //     }
        // ]
        transform: [
            {
                translateY: -16,
            }
        ]
    },
    carouselInputWrapper: {
        position: 'relative',
        height: 200,
        // borderRadius: 16,
        // overflow: 'hidden',
    },
    carouselInputHeading: {
        // fontFamily: 'Alata',
        // fontSize: 16,
        fontFamily: 'Jakarta',
        fontSize: 12,
        position: 'absolute',
        left: 0,
        top: 0,
        // transform: [
        //     {
        //         translateY: -28,
        //     }
        // ]
        transform: [
            {
                translateY: -24,
            }
        ]
    },
})