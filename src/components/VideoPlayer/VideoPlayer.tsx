import React, {memo, useEffect, useMemo, useState} from 'react';
import {Alert, View} from 'react-native';
import VideoPlayer from 'react-native-media-console';
import Orientation from 'react-native-orientation-locker';
import {styles} from './VideoPlayer.styles';
import {VIDEO} from '../../helpers/constants';
import useBackbuttonHandler from '../../hooks/useBackButtonHandler';
import {noop} from '../../helpers/functional';

type TVideoDisplayProps = {};
const videoRef = React.createRef<any>();

export const VideoDisplay = memo(({}: TVideoDisplayProps) => {
  const [fullScreenTapEnabled, setFullScreenTapEnabled] = useState(false);
  const [videoDisplayMode, setVideoDisplayMode] = useState<
    'portrait' | 'landscape'
  >(VIDEO.videoDisplayModes.portrait);

  const isPortrait = useMemo(() => {
    return videoDisplayMode === VIDEO.videoDisplayModes.portrait;
  }, [videoDisplayMode]);

  //https://www.google.com/search?q=react-native-pip-android&oq=react-native-pip-android&gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIHCAEQABiABNIBBzM3MGowajeoAgCwAgA&sourceid=chrome&ie=UTF-8
  useEffect(() => {
    const delay = setTimeout(() => {
      setFullScreenTapEnabled(true);
    }, 0); //this is workaround for https://github.com/LunatiqueCoder/react-native-media-console/issues/76 issue.
    return () => {
      clearTimeout(delay);
    }; // Clear the timeout when the effect unmounts
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      videoDisplayMode === VIDEO.videoDisplayModes.portrait
        ? Orientation.lockToPortrait()
        : Orientation.lockToLandscape();
    }, 0);
    return () => {
      clearTimeout(delay);
    }; // Clear the timeout when the effect unmounts
  }, [videoDisplayMode]);

  const switchToPortrait = () => {
    setVideoDisplayMode(VIDEO.videoDisplayModes.portrait);
    //videoRef?.current?.dismissFullscreenPlayer();
  };

  const switchToLandscape = () => {
    setVideoDisplayMode(VIDEO.videoDisplayModes.landscape);
    //videoRef?.current?.presentFullscreenPlayer();
  };

  const onFullScreenIconToggle = () => {
    if (fullScreenTapEnabled) {
      if (isPortrait) {
        switchToLandscape();
      } else {
        switchToPortrait();
      }
    }
  };

  const handleError = (errorObj: any) => {
    if (errorObj?.error?.errorCode === 'INVALID_URL') {
      return;
    }

    if (
      errorObj &&
      errorObj.error &&
      (errorObj.error.localizedDescription ||
        errorObj.error.localizedFailureReason)
    ) {
      let errorMessage = `${
        errorObj.error.code ? `${errorObj.error.code} : ` : ''
      } ${
        errorObj.error.localizedFailureReason
          ? errorObj.error.localizedFailureReason
          : errorObj.error.localizedDescription
          ? errorObj.error.localizedDescription
          : ''
      }`;
      Alert.alert('Error!', errorMessage, [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ]);
    } else {
      Alert.alert('Error!', 'An error occured while playing the video.', [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ]);
    }
  };

  useBackbuttonHandler(!isPortrait ? switchToPortrait : noop);

  return (
    <View
      style={
        isPortrait
          ? styles.portraitVideoContainer
          : styles.landscapeVideoContainer
      }>
      <VideoPlayer
        source={require('../../assets/BigBuckBunny.mp4')}
        showOnStart={false}
        onEnterFullscreen={onFullScreenIconToggle}
        onExitFullscreen={onFullScreenIconToggle}
        onBack={switchToPortrait}
        videoRef={videoRef}
        disableFocus={true}
        disableBack={isPortrait ? true : false}
        repeat
        videoStyle={{backgroundColor: 'white'}}
        disableDisconnectError={true}
        onError={handleError}
        controlAnimationTiming={VIDEO.controlAnimationTiming}
        controlTimeoutDelay={VIDEO.controlTimeoutDelay}
        rewindTime={VIDEO.rewindTime}
        resizeMode={VIDEO.resizeMode}
      />
    </View>
  );
});
