import { useEffect, useRef } from "react";
import {
  ActivityIndicator,
  Animated,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";
import logo from "../assets/logo.png";

export default function LoadingScreen() {
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fade, {
      toValue: 1,
      duration: 900,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={stylesMD.container}>
      <Animated.View style={[stylesMD.card, { opacity: fade }]}>
        <Image source={logo} style={stylesMD.logo} />
        <ActivityIndicator size="large" color="#0066ff" style={stylesMD.loader} />
        <Text style={stylesMD.text}>A carregar dados...</Text>
      </Animated.View>
    </View>
  );
}

const stylesMD = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",

    backgroundColor: "#dde8ff",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 35,
    borderRadius: 35,
    alignItems: "center",

    // Sombra estilo Material You
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  logo: {
    width: 130,
    height: 130,
    marginBottom: 22,
    resizeMode: "contain",
  },
  loader: {
    marginTop: 5,
  },
  text: {
    marginTop: 20,
    fontSize: 17,
    fontWeight: "600",
    color: "#2c3e50",
  },
});
