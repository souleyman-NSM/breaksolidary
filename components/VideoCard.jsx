// components/VideoCard.jsx

import { useState } from "react";
import { ResizeMode, Video } from "expo-av";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { icons } from "../constants";

const VideoCard = ({ title, creator, avatar, thumbnail, video }) => {
  const [play, setPlay] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatarWrapper}>
            <Image
              source={{ uri: avatar }}
              style={styles.avatar}
              resizeMode="cover"
            />
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
            <Text style={styles.creator} numberOfLines={1}>
              {creator}
            </Text>
          </View>
        </View>

        <View style={styles.menuIconContainer}>
          <Image
            source={icons.menu}
            style={styles.menuIcon}
            resizeMode="contain"
          />
        </View>
      </View>

      {play ? (
        <Video
          source={{ uri: video }}
          style={styles.video}
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls
          shouldPlay
          onPlaybackStatusUpdate={(status) => {
            if (status.didJustFinish) {
              setPlay(false);
            }
          }}
        />
      ) : (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setPlay(true)}
          style={styles.thumbnailContainer}
        >
          <Image
            source={{ uri: thumbnail }}
            style={styles.thumbnail}
            resizeMode="cover"
          />

          <Image
            source={icons.play}
            style={styles.playIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 56,
  },
  header: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
  },
  avatarContainer: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarWrapper: {
    width: 46,
    height: 46,
    borderRadius: 12,
    borderColor: "#FFA001", // secondary color
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 2,
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
    gap: 4,
  },
  title: {
    fontFamily: "Poppins-SemiBold", // replace with correct font name
    fontSize: 14,
    color: "#FFF",
  },
  creator: {
    fontFamily: "Poppins-Regular", // replace with correct font name
    fontSize: 12,
    color: "#CDCDE0", // grey color for text
  },
  menuIconContainer: {
    paddingTop: 8,
  },
  menuIcon: {
    width: 20,
    height: 20,
  },
  video: {
    width: "100%",
    height: 240,
    borderRadius: 16,
    marginTop: 12,
  },
  thumbnailContainer: {
    width: "100%",
    height: 240,
    borderRadius: 16,
    marginTop: 12,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  thumbnail: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
    marginTop: 12,
  },
  playIcon: {
    width: 48,
    height: 48,
    position: "absolute",
  },
});

export default VideoCard;