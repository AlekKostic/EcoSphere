import { Dimensions, StatusBar, Platform } from 'react-native';
import Constants from 'expo-constants';

const statusBarHeight = Constants.statusBarHeight;

const getWorkingHeight = () => {
  const { height } = Dimensions.get('window'); 


  if (Platform.OS === 'android') {
    const statusBarHeight = StatusBar.currentHeight || 0;
  } else if (Platform.OS === 'ios') {
    const statusBarHeight = Constants.statusBarHeight;
  }
  return height - statusBarHeight;
};

export default getWorkingHeight;
