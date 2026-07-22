import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Animated,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    useColorScheme,
} from "react-native";
import api from "../services/api";

export default function EsqueciSenha() {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  const emailValido = /\S+@\S+\.\S+/.test(email);

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

  async function handleSolicitar() {
    setErro("");
    setLoading(true);
    try {
      await api.post("/password/forgot", { email: email.trim() });
      router.push({ pathname: "/codeSent", params: { email: email.trim() } });
    } catch (err) {
      setErro(err.response?.data?.error || "Erro ao solicitar redefinição.");
    } finally {
      setLoading(false);
    }
  }

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
          name="mark-email-unread"
          size={72}
          color={isDark ? "#9eb4ff" : "#4a6bff"}
          style={{ alignSelf: "center", marginBottom: 10 }}
        />

        <Text style={[styles.title, isDark && styles.titleDark]}>
          Recuperar senha
        </Text>

        <Text style={[styles.subtitle, isDark && styles.textDark]}>
          Insira o e-mail associado à sua conta. Vamos enviar um código de
          verificação.
        </Text>

        <View
          style={[
            styles.inputWrapper,
            email.length > 0 && !emailValido && styles.inputError,
            emailValido && styles.inputSuccess,
            isDark && styles.inputDark,
          ]}
        >
          <MaterialIcons
            name="email"
            size={22}
            color={emailValido ? "#0a7d14" : "#777"}
            style={styles.icon}
          />
          <TextInput
            placeholder="E-mail"
            placeholderTextColor={isDark ? "#aaa" : "#777"}
            style={[styles.input, isDark && styles.textDark]}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        {erro ? <Text style={styles.erroText}>{erro}</Text> : null}

        <TouchableOpacity
          style={[styles.btn, (!emailValido || loading) && styles.btnDisabled]}
          disabled={!emailValido || loading}
          onPress={handleSolicitar}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>Enviar código</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.replace("/login")}>
          <Text style={[styles.backText, isDark && styles.textDark]}>
            Voltar ao Login
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

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
    backgroundColor: "#fff",
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
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
    color: "#1e1e1e",
  },
  titleDark: {
    color: "#fff",
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 22,
    color: "#555",
  },
  textDark: {
    color: "#ccc",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f5ff",
    borderWidth: 1.6,
    borderColor: "#c9d5ff",
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 56,
    marginBottom: 15,
  },
  inputDark: {
    backgroundColor: "#1f2530",
    borderColor: "#333",
  },
  inputSuccess: {
    borderColor: "#0a7d14",
    backgroundColor: "#e9ffe9",
  },
  inputError: {
    borderColor: "#ff3b30",
    backgroundColor: "#ffeaea",
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#222",
  },
  erroText: {
    color: "#ff3b30",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 12,
    textAlign: "center",
  },
  btn: {
    backgroundColor: "#4a6bff",
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 15,
  },
  btnDisabled: {
    backgroundColor: "#9eb4ff",
  },
  btnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  backText: {
    fontSize: 14,
    textAlign: "center",
    color: "#777",
  },
});
