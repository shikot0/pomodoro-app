import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Text, Pressable, Dimensions} from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { StatusBar } from 'expo-status-bar';


const {width, height} = Dimensions.get('screen');

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <>
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          // backgroundColor: 'transparent'
          // position: 'absolute',
          // borderRadius: 100,
          // backgroundColor: 'rgba(0, 0, 0, .75)',
          // bottom: 16,
          // width: 250,
          // height: 65,
          // left: width/2,
          // transform: [
          //   {
          //     translateX: -125
          //   }
          // ]
          // height: 75,
          // paddingVertical: 16,
        }
      }}
      
      // tabBar={({descriptors, insets, navigation, state}) => <TabBar />}
      // tabBar={({descriptors, insets, navigation, state}) => <TabBar descriptors={descriptors} />}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Timer',
          // headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="clock-o" color={color} />,
          headerRight: () => (
            <Link href="/settingsModal" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="info-circle"
                    size={25}
                    color={Colors[colorScheme ?? 'light'].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen 
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({color}) => <TabBarIcon name="gear" color={color} />
        }}
      />

      {/* <Tabs.Screen
        name="sessions"
        options={{
          title: 'Sessions',
          tabBarIcon: ({ color }) => <TabBarIcon name="gear" color={color} />,
        }}
      /> */}
    </Tabs>
    <StatusBar hidden={false} backgroundColor="black" />
    </>
  );
}
