import {Dimensions, Platform} from 'react-native';
import {TVideo} from '../types';
import DeviceInfo from 'react-native-device-info';

export const getWindowWidth = () => Dimensions.get('window').width;
export const getWindowHeight = () => Dimensions.get('window').height;

const deviceType = DeviceInfo.getDeviceType();

export const isIos = () => Platform.OS === 'ios';
export const isTablet = () => deviceType === 'Tablet';

export const VIDEO: TVideo = {
  controlAnimationTiming: isIos() ? 500 : 0,
  controlTimeoutDelay: 10000,
  rewindTime: 5,
  resizeMode: 'contain',
  videoDisplayModes: {
    portrait: 'portrait',
    landscape: 'landscape',
  },
};
