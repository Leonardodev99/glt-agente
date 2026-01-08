import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useRef } from "react";
import {
    Animated,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    useColorScheme,
} from "react-native";

export default function CodeSent() {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  // ANIMAÇÃO
  const slideAnim = useRef(new Animated.Value(40)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <Animated.View
        style={[
          styles.box,
          isDark && styles.boxDark,
          {
            opacity: opacityAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >

        <MaterialIcons
          name="mark-email-read"
          size={78}
          color={isDark ? "#9eb4ff" : "#4a6bff"}
          style={{ alignSelf: "center", marginBottom: 15 }}
        />

        <Text style={[styles.title, isDark && styles.titleDark]}>
          Código Enviado!
        </Text>

        <Text style={[styles.text, isDark && styles.textDark]}>
          Enviamos um código de verificação para o seu e-mail.  
          Digite o código na próxima tela para redefinir sua senha.
        </Text>

        {/* Botão: Continuar */}
        <TouchableOpacity
          style={styles.btn}
          onPress={() => router.push("/passwordReset")}
        >
          <Text style={styles.btnText}>Continuar</Text>
        </TouchableOpacity>

        {/* Reenviar código */}
        <TouchableOpacity style={styles.secondBtn}>
          <Text style={[styles.secondText, isDark && styles.secondTextDark]}>
            Reenviar código
          </Text>
        </TouchableOpacity>

        {/* Voltar ao Login */}
        <TouchableOpacity onPress={() => router.replace("/login")}>
          <Text style={[styles.backText, isDark && styles.secondTextDark]}>
            Voltar ao Login
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

// ESTILOS MATERIAL YOU
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eef2ff",
    padding: 25,
  },
  containerDark: {
    backgroundColor: "#0c0f14",
  },

  box: {
    width: "100%",
    backgroundColor: "#ffffff",
    padding: 28,
    borderRadius: 28,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  boxDark: {
    backgroundColor: "#161b22",
  },

  title: {
    fontSize: 30,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 10,
    color: "#1e1e1e",
  },
  titleDark: {
    color: "#fff",
  },

  text: {
    fontSize: 16,
    color: "#444",
    textAlign: "center",
    marginBottom: 25,
  },
  textDark: {
    color: "#ccc",
  },

  btn: {
    backgroundColor: "#4a6bff",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 15,
  },
  btnText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },

  secondBtn: {
    marginBottom: 10,
  },
  secondText: {
    fontSize: 16,
    color: "#4a6bff",
    textAlign: "center",
    fontWeight: "600",
  },
  secondTextDark: {
    color: "#9eb4ff",
  },

  backText: {
    fontSize: 14,
    textAlign: "center",
    color: "#777",
    marginTop: 10,
  },
});
