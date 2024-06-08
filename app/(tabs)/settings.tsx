import { CircularProgress } from "@/components/CircularComponents";
import { Heading } from "@/components/StyledText";
import { Text, View } from "@/components/Themed";
import { localSettingsStore } from "@/constants/globalState";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { ColorValue, Pressable, StyleSheet } from "react-native";

export default function SettingsPage() {
    const {settings, changeSetting} = localSettingsStore();
    const {appTheme, timerSliderWidth} = settings;
    // console.log({startSettings: settings})
    // const [selectedColor, setSelectedColor] = useState<ColorValue | null>(appTheme)
    const colorOptions = ['rgba(0, 150, 0, 1)', 'grey', 'red', 'blue'];
    // const sizeOptions = [10, 15, 20, 25];
    const sizeOptions = [{value: 10, title: 'Thin'}, {value: 15, title: 'Regular'}, {value: 20, title: 'Thick'}];


    async function handleSetSelectedColor(color: ColorValue) {
        changeSetting('appTheme', color);
        await AsyncStorage.setItem('settings', JSON.stringify(settings));
        // console.log({changedSettings: settings})
    }
    async function handleSetSelectedSize(size: number) {
        changeSetting('timerSliderWidth', size);
        await AsyncStorage.setItem('settings', JSON.stringify(settings));
        // console.log({changedSettings: settings})
    }
    return (
        <View style={styles.settingsPage}>
            <Heading>Settings</Heading>
            <View style={styles.formWrapper}>
                <View style={styles.colorInputWrapper}>
                    <Text>App Theme</Text>
                    <View style={styles.optionsWrapper}>
                        {colorOptions.map((color, index) => {
                            return (
                                // <View key={index.toString()} style={[styles.colorOption, index === selectedColor ? styles.selectedColor : {},{backgroundColor: option}]}>

                                // </View>
                                <Pressable 
                                    key={index.toString()}
                                    onPress={async () => await handleSetSelectedColor(color)}
                                    // style={[styles.colorOption, index === selectedColor ? styles.selectedColor : {}, {backgroundColor: option}]}
                                    style={[styles.colorOption, color === appTheme ? styles.selectedColor : {}]}
                                >
                                    <View style={[styles.colorOptionBase, {backgroundColor: color}]} />
                                </Pressable>
                            )
                        })}
                    </View>
                </View> 
                <View style={styles.widthOptionsWrapper}>
                    <Text>Timer Size</Text>
                    <View style={styles.optionsWrapper}>
                        {sizeOptions.map(({value, title}, index) => {
                            return (
                                // <View key={index.toString()} style={[styles.colorOption, index === selectedColor ? styles.selectedColor : {},{backgroundColor: option}]}>
                                // </View>
                                <Pressable 
                                    key={index.toString()}
                                    onPress={async () => await handleSetSelectedSize(value)}
                                    // style={[styles.colorOption, index === selectedColor ? styles.selectedColor : {}, {backgroundColor: option}]}
                                    style={[styles.timerWidthOption, value === timerSliderWidth ? styles.selectedColor : {}]}
                                >
                                    {/* <CircularProgress value={45} lineWidth={value} size={150} circleLength={250} />   */}
                                    <CircularProgress value={75} lineWidth={value * .75} size={150} circleLength={250} />  
                                    <Text>{title}</Text>
                                </Pressable>    
                            )
                        })}
                    </View>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    settingsPage: {
        flex: 1,
        gap: 32,
        // padding: 16,
        // paddingHorizontal: 16,
        paddingVertical: 48,
        paddingHorizontal: 16,
    },
    formWrapper: {
        gap: 48,
    },
    colorInputWrapper: {
        width: '100%',
        display: 'flex',
        gap: 16,
    },
    optionsWrapper: {
        display: 'flex',
        flexDirection: 'row',
        gap: 16,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap'
    },
    colorOption: {
        position: 'relative',
        // flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        // width: 36, 
        // height: 36,
        borderWidth: 4,
        borderStyle: 'solid',
        borderColor: 'transparent',
        borderRadius: 4,
        padding: 8,
    },
    colorOptionBase: {
        width: 36, 
        height: 36,
    },
    timerWidthOption: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        // width: 150,
        width: 175,
        aspectRatio: 1,
        borderRadius: 8,
        paddingVertical: 8,
        borderWidth: 1,
        // borderColor: 'red',
        borderStyle: 'solid'
    },
    widthOptionsWrapper: {
        display: 'flex',
        gap: 16,
    },
    selectedColor: {
        // borderWidth: 4,
        borderColor: 'white',
        // borderStyle: 'solid'
    }
})  