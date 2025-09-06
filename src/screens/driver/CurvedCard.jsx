import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from '../../styles/commonStyles';

const { width: screenWidth } = Dimensions.get('window');

const CurvedCard = ({
  icon = 'notifications-outline',
  title = 'This is title',
  bottomTitle = 'lower',
  description = 'description',
  firstColor = '#1bbd1bff',
  secondColor = '#b3e8aeff',
}) => {
  return (
    <View
      style={{
        borderRadius: 20,
        overflow: 'hidden',
        width: screenWidth / 2 - 30,
        elevation: 3,
        backgroundColor: Colors.whiteColor,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      }}
    >
      <View style={{ height: 100, position: 'relative' }}>
        <LinearGradient
          colors={[firstColor, secondColor]}
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 1 }}
          style={{
            height: 100,
            width: '100%',
            borderBottomRightRadius: 50,
            justifyContent: 'space-evenly',
            alignItems: 'center',
            flexDirection: 'row',
            padding:10,
            gap: 15,
          }}
        >
          <View
            style={{
              borderWidth: 2,
              padding: 4,
              borderRadius: 10,
              borderColor: Colors.whiteColor,
            }}
          >
            <Ionicons name={icon} size={28} color={Colors.whiteColor} />
          </View>
          <Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold' }}>
            {title}
          </Text>
        </LinearGradient>
      </View>

      <LinearGradient
        colors={[firstColor, secondColor]}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 1 }}
      >
        <View
          style={{
            padding: 15,
            backgroundColor: '#fff',
            borderTopLeftRadius: 50,
          }}
        >
          <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#333' }}>
            {bottomTitle}
          </Text>
          <Text style={{ fontSize: 12, color: '#666', marginTop: 5 }}>
            {description}
          </Text>
        </View>
      </LinearGradient>
    </View>
  );
};

export default CurvedCard;
