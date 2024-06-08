import {create} from 'zustand';
import { LocalSettings, Session } from './Types';

interface LocalSessionsStoreType {
    sessions: Session[],
    setSessions: Function,
    addNewSession: Function,
    deleteSession: Function
}


export const localSessionsStore = create<LocalSessionsStoreType>((set) => ({
    sessions: [],
    setSessions: (newSessions: any[]) => {
        set(() => {
            return {sessions: newSessions}
        })
    },
    addNewSession: (newSession: any) => {
        set(({sessions}) => {
            sessions.push(newSession);
            return {sessions}
        })
    },
    deleteSession: (id: string) => {
        set(({sessions}) => {
            let newSessions = sessions.filter(session => session.id !== id);
            return {sessions: newSessions}
        })
    }
}))

interface LocalSettingsStoreType {
    settings: LocalSettings,
    setSettings: Function,
    // changeSetting: Function,
    // changeSetting: (settingName: keyof LocalSettings, value: keyof LocalSettings[typeof settingName]) => void,
    // changeSetting: (settingName: keyof LocalSettings, value: any) => void,
    // changeSetting: (settingName: keyof LocalSettings, value: LocalSettings[typeof settingName]) => void,
    // changeSetting: (settingName: keyof LocalSettings, value: typeof settingName) => void,
    // changeSetting: (settingName: any, value: any) => void,
    // changeSetting: (settingName: keyof LocalSettings, value: LocalSettings[typeof settingName]) => void,
    changeSetting: <T extends keyof LocalSettings> (settingName: T, value: LocalSettings[T]) => void
}



export const localSettingsStore = create<LocalSettingsStoreType>((set) => ({
    settings: {
        appTheme: 'rgba(0, 150, 0, 1)',
        timerSliderWidth: 15
    },
    setSettings: (settings: LocalSettings) => {
        set(() => {
            return {settings}
        })
    },
    // changeSetting: (settingName: keyof LocalSettings, value: keyof LocalSettings[typeof settingName]) => {
    // changeSetting: (settingName: keyof LocalSettings, value: any) => {
    // changeSetting: (settingName: keyof LocalSettings, value: LocalSettings[typeof settingName]) => {
    // changeSetting: (settingName: keyof LocalSettings, value: LocalSettings[keyof settingName]) => {
    // changeSetting: (settingName: keyof LocalSettings, value: LocalSettings[typeof settingName]) => {
    // changeSetting: (settingName: keyof LocalSettings, value: any) => {
    // changeSetting: (settingName: keyof LocalSettings , value: LocalSettings[typeof settingName]) => {
    // changeSetting: (settingName: any, value: any) => {
    // changeSetting: (settingName: any, value: any) => { 
    // changeSetting: (settingName: string, value: LocalSettings[typeof settingName]) => {
    changeSetting: <T extends keyof LocalSettings> (settingName: T, value: LocalSettings[T]) => {
        set(({settings}) => {
            
            // settings[settingName] = value;
            
            // settings[settingName as keyof LocalSettings] = value;

            settings[settingName] = value
            // return {settings}; 
            return {settings}
        })
    }
}))