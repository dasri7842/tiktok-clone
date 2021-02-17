import React, {useState} from 'react';
import {StyleSheet, TouchableWithoutFeedback} from 'react-native';
import Video from 'react-native-video';

const SingleVideo = ({playbackUrl}) => {
  const [ispaused, setIspaused] = useState(false);
  return (
    <TouchableWithoutFeedback onPress={() => setIspaused(!ispaused)}>
      <Video
        source={{
          uri: playbackUrl,
        }}
        paused={ispaused}
        onError={(e) => console.log(e)} // getting error here for some videos : {"error": {"extra": -1004, "what": 1}}
        resizeMode={'cover'}
        repeat={true}
        style={styles.backgroundVideo}
      />
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});

export default SingleVideo;
