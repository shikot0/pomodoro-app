import { ColorValue } from "react-native";

export interface Session {
    id: string,
    title: string,
    lengthOfBreak: number,
    sessionDuration: number,
    numberOfSessions: number,
}

// export interface LocalSettings {
export type LocalSettings = {
    appTheme: ColorValue,
    // timerSliderWidth: "5" | "10" | "15" | "20" | "25" | "30",
    timerSliderWidth: number,
}    