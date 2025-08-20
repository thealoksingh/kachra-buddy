import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import SwipableTabs from '../../components/SwipableTabs'
import Cart from './Cart'
import { CommonAppBar } from '../../components/commonComponents';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../styles/commonStyles';
const BookingScreen = () => {
    const navigation = useNavigation();
   
  return (
    <View style={{flex: 1,backgroundColor:Colors.whiteColor}}>
       <CommonAppBar navigation={navigation} label={'Bookings'} />
      <SwipableTabs
        titles={['Ongoing Bookings', 'Previous Bookings']}
        components={[
          <View><Text>Hello Journey</Text></View>,
          <View><Text>Hello Order</Text></View>
        ]}
      />
    </View>
  )
}

export default BookingScreen

const styles = StyleSheet.create({})
