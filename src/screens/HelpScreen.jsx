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
import {
  ButtonWithLoader,
  InputBox,
  TextArea,
} from '../components/commonComponents';
import { supportTicket } from '../store/thunks/authThunk';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser } from '../store/selector';
import { showSnackbar } from '../store/slices/snackbarSlice';
import { showLottieAlert } from '../store/slices/lottieAlertSlice';
import { LottieAlert } from '../components/lottie/LottieAlert';

const HelpScreen = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();


  const [subject, setSubject] = useState('');
  const [name, setName] = useState(user?.fullName || '');
  const [mobileNumber, setMobileNumber] = useState(user?.contactNumber || '');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    if (!subject.trim()) {
      dispatch(showSnackbar({ message: 'Subject is required', type: 'error' }));
      return false;
    }
    if (!name.trim()) {
      dispatch(showSnackbar({ message: 'Name is required', type: 'error' }));
      return false;
    }
    if (!mobileNumber.trim()) {
      dispatch(showSnackbar({ message: 'Mobile number is required', type: 'error' }));
      return false;
    }
    if (mobileNumber.length !== 10) {
      dispatch(showSnackbar({ message: 'Mobile number must be 10 digits', type: 'error' }));
      return false;
    }
    if (!description.trim()) {
      dispatch(showSnackbar({ message: 'Description is required', type: 'error' }));
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      const ticketBody = {
        userId: user?.id || 0,
        subject: subject,
        description: description,
        userName: name,
        userContact: mobileNumber,
      };
      console.log('ticketBody==>', ticketBody);
      const response = await dispatch(supportTicket(ticketBody));
      console.log('ticket response==>', response);
      if (response.type.endsWith('/fulfilled')) {
        dispatch(showLottieAlert({ type: 'success', message: 'Ticket Created Successfully', autoClose: true }));
        setSubject('');
        setDescription('');
      } else {
        dispatch(showLottieAlert({ type: 'failure', message: 'Something went wrong, Try Again', autoClose: true }));
      }
    } catch (error) {
      dispatch(showLottieAlert({ type: 'failure', message: 'Error submitting ticket', autoClose: true }));
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

      <LottieAlert />
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
