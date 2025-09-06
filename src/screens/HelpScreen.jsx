import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  Image,
  View,
  Platform,
  TouchableOpacity,
} from 'react-native';
import React, { useRef, useState } from 'react';
import {
  Colors,
  Fonts,
  Sizes,
  commonStyles,
  screenWidth,
} from '../styles/commonStyles';
import MyStatusBar from '../components/MyStatusBar';
import { ButtonWithLoader, InputBox, TextArea } from '../components/commonComponents';

const HelpScreen = () => {
  const [title, setTitle] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
    console.log('Handle submit called');
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
      <MyStatusBar />

      <View style={{ flex: 1, paddingHorizontal: 20 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          automaticallyAdjustKeyboardInsets={true}
        >
          {helpImage()}
          {talkingInfo()}
          <InputBox
            value={mobileNumber}
            setter={setMobileNumber}
            placeholder={'Enter Contact Number'}
            label={'Contact Number'}
            optional={false}
            type={'phone-pad'}
          />
          <InputBox
            value={email}
            setter={setEmail}
            placeholder={'Enter Email Id'}
            label={'Email Id'}
            optional={true}
            type={'phone-pad'}
          />

          <TextArea
            value={description}
            setter={setDescription}
            placeholder={'PLease Describe Your Query'}
            label={'Query'}
            optional={false}
          />
          <ButtonWithLoader
            name="Submit"
            loadingName="Processing..."
            isLoading={isLoading}
            method={handleSubmit}
          />
        </ScrollView>
      </View>
    </View>
  );

  function talkingInfo() {
    return (
      <View
        style={{
          marginVertical: Sizes.fixPadding,
        }}
      >
        <Text style={{ ...Fonts.blackColor12Bold }}>
          Talk to our support team
        </Text>
        <Text style={{ ...Fonts.grayColor12Regular }}>
          Fill the form below and our support team will be in touch with you
          shortly.
        </Text>
      </View>
    );
  }

  function helpImage() {
    return (
      <Image
        source={require('../../assets/images/help.png')}
        style={styles.helpImageStyle}
      />
    );
  }
};

export default HelpScreen;

const styles = StyleSheet.create({
  helpImageStyle: {
    width: '100%',
    height: screenWidth / 1.5,
    resizeMode: 'contain',
    marginVertical: Sizes.fixPadding,
    // backgroundColor:"teal"
  },
});
