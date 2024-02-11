import React, {memo, useEffect, useMemo, useState} from 'react';
import {Alert, View} from 'react-native';
import VideoPlayer from 'react-native-media-console';
import Orientation from 'react-native-orientation-locker';
import {styles} from './VideoPlayer.styles';
import {VIDEO, isIos} from '../../helpers/constants';
import useBackbuttonHandler from '../../hooks/useBackButtonHandler';
import {noop} from '../../helpers/functional';
import {useAnimations} from '@react-native-media-console/reanimated';

const videoRef = React.createRef<any>();

export const VideoDisplay = memo(() => {
  const [fullScreenTapEnabled, setFullScreenTapEnabled] = useState(false);
  const [videoDisplayMode, setVideoDisplayMode] = useState<
    'portrait' | 'landscape'
  >(VIDEO.videoDisplayModes.portrait);
  // Use this boolean to show / hide ui when pip mode changes

  const isPortrait = useMemo(() => {
    return videoDisplayMode === VIDEO.videoDisplayModes.portrait;
  }, [videoDisplayMode]);

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
    if (!isIos()) {
      videoRef?.current?.dismissFullscreenPlayer();
    }
  };

  const switchToLandscape = () => {
    setVideoDisplayMode(VIDEO.videoDisplayModes.landscape);
    if (!isIos()) {
      videoRef?.current?.presentFullscreenPlayer();
    }
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
    <>
      <View
        style={
          isPortrait
            ? styles.portraitVideoContainer
            : styles.landscapeVideoContainer
        }>
        <VideoPlayer
          source={require('../../assets/BigBuckBunny.mp4')}
          showOnStart={false}
          title="Big Buck Bunny 2024"
          onEnterFullscreen={onFullScreenIconToggle}
          onExitFullscreen={onFullScreenIconToggle}
          onBack={switchToPortrait}
          videoRef={videoRef}
          disableFocus={true}
          disableBack={isPortrait}
          useAnimations={useAnimations}
          repeat
          playInBackground={false}
          videoStyle={{backgroundColor: 'white'}}
          disableDisconnectError={true}
          onError={handleError}
          controlAnimationTiming={VIDEO.controlAnimationTiming}
          controlTimeoutDelay={VIDEO.controlTimeoutDelay}
          rewindTime={VIDEO.rewindTime}
          resizeMode={VIDEO.resizeMode}
        />
      </View>
    </>
  );
});
