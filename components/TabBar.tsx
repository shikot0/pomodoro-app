import { NavigationHelpers, ParamListBase, TabNavigationState } from "@react-navigation/native"
import { EdgeInsets } from "react-native-safe-area-context"

interface TabBarProps {
    descriptors: null,
    insets: EdgeInsets,
    // navigation: NavigationHelpers<ParamListBase, BottomTabNavigationEventMap>,
    navigation: NavigationHelpers<ParamListBase>,
    state: TabNavigationState<ParamListBase>
}

export default function TabBar({descriptors, insets, navigation, state}: TabBarProps) {
    return (
        <></>
    )
}