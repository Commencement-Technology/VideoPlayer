import {getWindowWidth, isTablet} from '../../helpers/constants';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  portraitVideoContainer: {
    width: '100%',
    height: isTablet() ? 350 : 224,
  },
  landscapeVideoContainer: {
    width: '100%',
    height: getWindowWidth(),
  },
  pipVideoContainer: {
    width: 200,
    height: 125,
    backgroundColor: 'red',
  },
});
