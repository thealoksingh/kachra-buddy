
import { Dimensions, StyleSheet } from 'react-native';

export const Colors = {
  primary: '#101942',
  secondary: '#FF5722',
  secondaryLight: "#FF8C00",
  bodyBackColor: "#F2F2F2",
  blackColor: "#000000",
  whiteColor: "#FFFFFF",
  grayColor: "#828282",
  lightBlackColor: "#333333",
  redColor: "#FF0606",
  lightGreenColor: "#90EE90",
  greenColor: "#4CAF50",
  yellowColor: "#F2C94C",
}
export const appFonts = {
  regular: 'Poppins-Regular',
  medium: 'Poppins-Medium',
  bold: 'Poppins-Bold',
  light: 'Poppins-Light',
  semiBold: 'Poppins-SemiBold',
  extraBold: 'Poppins-ExtraBold',
  italic: 'Poppins-Italic',
};

export const fontSizes = {
  xxxs: 6,
  xxs: 8,
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 20,
  xxl: 26,
  xxxl: 30,
};


// Predefined text styles
export const textStyles = StyleSheet.create({
  heading: {
    fontFamily: appFonts.bold,
    fontSize: fontSizes.xl,
  },
  subHeading: {
    fontFamily: appFonts.semiBold,
    fontSize: fontSizes.lg,
  },
  body: {
    fontFamily: appFonts.regular,
    fontSize: fontSizes.md,
  },
  extraSmall: {
    fontFamily: appFonts.light,
    fontSize: fontSizes.xs,
  },
  small: {
    fontFamily: appFonts.light,
    fontSize: fontSizes.sm,
  },
   smallBold: {
    fontFamily: appFonts.bold,
    fontSize: fontSizes.sm,
  },
  italic: {
    fontFamily: appFonts.italic,
    fontSize: fontSizes.md,
  },
  buttonText: {
    fontFamily: appFonts.medium,
    fontSize: fontSizes.lg,
  },
  title: {
    fontFamily: appFonts.extraBold,
    fontSize: fontSizes.xxl,
  },
  largeTitle:{
    fontFamily: appFonts.bold,
    fontSize: fontSizes.xxxl,
  }
});


export const Sizes = {
  fixPadding: 10.0,
};

export const commonStyles = {
  shadow: {
    elevation: 2.0,
    shadowColor: Colors.grayColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
  },
  rowSpaceBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowAlignCenter: {
    flexDirection: "row",
    alignItems: "center",
  },
  button: {
    backgroundColor: Colors.primaryColor,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    padding: Sizes.fixPadding * 1,
  },
  outlinedButton: {
    backgroundColor: Colors.whiteColor,
    borderColor: Colors.primaryColor,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    padding: Sizes.fixPadding * 1,
  },
  outlinedButtonText: {
    color: Colors.primaryColor,
    fontSize: 14,
    fontWeight: "bold",
  },
  buttonText: {
    color: Colors.whiteColor,
    fontSize: 14,
    fontWeight: "bold",
  },
  boxInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    padding: 12,
    fontSize: 12,
    backgroundColor: "#f5f5f5",
    height: 45,
  },
};

export const screenWidth = Dimensions.get("window").width;

export const screenHeight = Dimensions.get("window").height;