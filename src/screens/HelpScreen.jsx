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
import { supportTicket } from '../store/thunks/authThunk';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser } from '../store/selector';
import { showSnackbar } from '../store/slices/snackbarSlice';

const HelpScreen = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  
  const [subject, setSubject] = useState('');
  const [name, setName] = useState(user?.fullName || '');
  const [mobileNumber, setMobileNumber] = useState(user?.contactNumber || '');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const ticketBody = {
        userId: user?.id || 0,
        subject: subject,
        description: description,
        type: "TECHNICAL",
        status: "OPEN",
        priority: "LOW",
        userName: name,
        userContact: mobileNumber
      };
      console.log("ticketBody==>",ticketBody);
      const response = await dispatch(supportTicket(ticketBody));
      console.log('Response:', response);
      
      if (response.type.endsWith('/fulfilled')) {
        dispatch(showSnackbar({ message: 'Support ticket submitted successfully!', type: 'success' }));
        setSubject('');
        setDescription('');
      } else {
        console.log('Response payload:', response.payload);
        dispatch(showSnackbar({ message: response.payload?.message || 'Failed to submit ticket. Please try again.', type: 'error' }));
      }
    } catch (error) {
      dispatch(showSnackbar({ message: 'Error submitting ticket', type: 'error' }));
    } finally {
      setIsLoading(false);
    }
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
            value={subject}
            setter={setSubject}
            placeholder={'Enter Subject'}
            label={'Subject'}
            optional={false}
            type={'default'}
          />
          <InputBox
            value={name}
            setter={setName}
            placeholder={'Enter Your name'}
            label={'Name'}
            optional={false}
            type={'default'}
          />
          <InputBox
            value={mobileNumber}
            setter={setMobileNumber}
            placeholder={'Enter Contact Number'}
            label={'Contact Number'}
            optional={false}
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
