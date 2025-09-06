import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Colors, Fonts, Sizes, commonStyles } from '../../styles/commonStyles';
import { View, StyleSheet, Text, BackHandler, Platform } from 'react-native';
import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import DriverHome from '../../screens/driver/DriverHome';
import PickupRequests from '../../screens/driver/PickupRequests';
import DriverProfileScreen from '../../screens/driver/DriverProfileScreen';

const Tab = createBottomTabNavigator();

const DriverBottomNavBar = ({ navigation }) => {
  const [backClickCount, setBackClickCount] = useState(0);

  const backAction = () => {};

  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );

      return () => backHandler.remove();
    }, [backClickCount]),
  );

  function _spring() {
    setBackClickCount(1);
    setTimeout(() => {
      setBackClickCount(0);
    }, 1000);
  }

  return (
    <>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: Colors.primary,
          tabBarInactiveTintColor: Colors.lightGrayColor,
          tabBarHideOnKeyboard: true,
          headerShown: false,
          tabBarShowLabel: true,
          tabBarLabelStyle: {
            fontSize: 10,
            marginTop: 4,
            fontWeight: '400',
          },
          tabBarIconStyle: { alignSelf: 'center' },
          tabBarStyle: styles.tabBarStyle,
        }}
      >
        <Tab.Screen
          name="Home"
          component={DriverHome}
          //  component={LocationPickerScreen}
          options={{
            tabBarIcon: ({ focused }) =>
              focused ? (
                // <View style={styles.selectedTabCircleStyle}>
                <MaterialIcons name="home" size={26} color={Colors.primary} />
              ) : (
                // </View>
                <MaterialIcons name="home" size={26} color={Colors.grayColor} />
              ),
            tabBarLabel: 'Home',
          }}
        />

        <Tab.Screen
          name="Pickup"
          component={PickupRequests}
          options={{
            tabBarIcon: ({ focused }) =>
              focused ? (
                // <View style={styles.selectedTabCircleStyle}>
                <MaterialIcons
                  name="event-available"
                  size={24}
                  color={Colors.primary}
                />
              ) : (
                // </View>
                <MaterialIcons
                  name="event-available"
                  size={24}
                  color={Colors.grayColor}
                />
              ),
            tabBarLabel: 'Bookings',
          }}
        />
        <Tab.Screen
          name="Profile"
          component={DriverProfileScreen}
          options={{
            tabBarIcon: ({ focused }) =>
              focused ? (
                // <View style={styles.selectedTabCircleStyle}>
                <MaterialIcons name="person" size={25} color={Colors.primary} />
              ) : (
                // </View>
                <MaterialIcons
                  name="person"
                  size={25}
                  color={Colors.grayColor}
                />
              ),
            tabBarLabel: 'Profile',
          }}
        />
      </Tab.Navigator>
      {exitInfo()}
    </>
  );

  function exitInfo() {
    return backClickCount == 1 ? (
      <View style={styles.exitInfoWrapStyle}>
        <Text style={{ ...Fonts.whiteColor14Medium }}>
          Press Back Once Again To Exit!
        </Text>
      </View>
    ) : null;
  }
};

export default DriverBottomNavBar;

const styles = StyleSheet.create({
  exitInfoWrapStyle: {
    backgroundColor: Colors.lightBlackColor,
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    borderRadius: Sizes.fixPadding * 2.0,
    paddingHorizontal: Sizes.fixPadding + 5.0,
    paddingVertical: Sizes.fixPadding,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedTabCircleStyle: {
    width: 35.0,
    height: 35.0,
    borderRadius: 25.0,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBarStyle: {
    backgroundColor: Colors.bodyBackColor,
    ...commonStyles.shadow,
    borderTopColor: Colors.extraLightGrayColor,
    borderTopWidth: 1.0,
    height: Platform.OS == 'ios' ? 100.0 : 70.0,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
  },
});
