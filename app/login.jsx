import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
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

export default function Login() {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  const [focusEmail, setFocusEmail] = useState(false);
  const [focusPass, setFocusPass] = useState(false);

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  const emailValido = /\S+@\S+\.\S+/.test(email);
  const senhaValida = senha.length >= 4;

  // ANIMAÇÃO DO CARD
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

  async function handleLogin() {
    setErro("");
    setLoading(true);

    try {
      const response = await api.post("/tokens", { email, senha });
      const { user, token } = response.data;

      // Este app é só para agentes em campo — bloqueia login de admin aqui
      if (user.type !== "agente") {
        setErro("Esta conta não tem acesso ao app do agente.");
        return;
      }

      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("user", JSON.stringify(user));

      router.push("/agentDashboard");
    } catch (err) {
      const mensagem =
        err.response?.data?.error || "Erro ao entrar. Verifique sua conexão.";
      setErro(mensagem);
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
        <Text style={[styles.title, isDark && styles.titleDark]}>Entrar</Text>

        {/* INPUT EMAIL */}
        <View
          style={[
            styles.inputWrapper,
            focusEmail && styles.inputActive,
            email.length > 0 && !emailValido && styles.inputError,
            emailValido && styles.inputSuccess,
            isDark && styles.inputDark,
          ]}
        >
          <MaterialIcons
            name="email"
            size={22}
            color={
              emailValido
                ? "#0a7d14"
                : focusEmail
                ? "#4a6bff"
                : isDark
                ? "#aaa"
                : "#777"
            }
            style={styles.icon}
          />
          <TextInput
            placeholder="E-mail"
            placeholderTextColor={isDark ? "#aaa" : "#777"}
            style={[styles.input, isDark && styles.textDark]}
            onFocus={() => setFocusEmail(true)}
            onBlur={() => setFocusEmail(false)}
            onChangeText={setEmail}
            value={email}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        {/* INPUT SENHA */}
        <View
          style={[
            styles.inputWrapper,
            focusPass && styles.inputActive,
            senha.length > 0 && !senhaValida && styles.inputError,
            senhaValida && styles.inputSuccess,
            isDark && styles.inputDark,
          ]}
        >
          <MaterialIcons
            name="lock"
            size={22}
            color={
              senhaValida
                ? "#0a7d14"
                : focusPass
                ? "#4a6bff"
                : isDark
                ? "#aaa"
                : "#777"
            }
            style={styles.icon}
          />
          <TextInput
            placeholder="Senha"
            placeholderTextColor={isDark ? "#aaa" : "#777"}
            secureTextEntry={!showPassword}
            style={[styles.input, isDark && styles.textDark]}
            onFocus={() => setFocusPass(true)}
            onBlur={() => setFocusPass(false)}
            onChangeText={setSenha}
            value={senha}
          />

          {/* Toggle senha */}
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <MaterialIcons
              name={showPassword ? "visibility-off" : "visibility"}
              size={22}
              color={isDark ? "#aaa" : "#777"}
            />
          </TouchableOpacity>
        </View>

        {/* MENSAGEM DE ERRO */}
        {erro ? <Text style={styles.erroText}>{erro}</Text> : null}

        {/* ESQUECI A SENHA */}
        <TouchableOpacity
          style={styles.forgotBtn}
          onPress={() => router.push("/esqueciSenha")}
        >
          <Text style={[styles.forgotText, isDark && styles.textDark]}>
            Esqueci minha senha
          </Text>
        </TouchableOpacity>

        {/* BOTÃO ACESSAR */}
        <TouchableOpacity
          style={[
            styles.btn,
            (!(emailValido && senhaValida) || loading) && styles.btnDisabled,
          ]}
          disabled={!(emailValido && senhaValida) || loading}
          onPress={handleLogin}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>Acessar</Text>
          )}
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Fundo estilo Material You
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eef2ff",
    paddingHorizontal: 25,
  },
  containerDark: {
    backgroundColor: "#0c0f14",
  },

  // Caixa estilo Material You (super suave)
  box: {
    width: "100%",
    backgroundColor: "#ffffff",
    padding: 28,
    borderRadius: 28,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 3 },
  },
  boxDark: {
    backgroundColor: "#161b22",
    shadowOpacity: 0.3,
  },

  title: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 25,
    textAlign: "center",
    color: "#1e1e1e",
  },
  titleDark: {
    color: "#fff",
  },

  // Inputs Material You
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

  inputActive: {
    borderColor: "#4a6bff",
    backgroundColor: "#e8edff",
  },
  inputSuccess: {
    borderColor: "#0a7d14",
    backgroundColor: "#e9ffe9",
  },
  inputError: {
    borderColor: "#ff3b30",
    backgroundColor: "#ffeaea",
  },

  icon: { marginRight: 10 },

  input: {
    flex: 1,
    fontSize: 16,
    color: "#222",
  },
  textDark: {
    color: "#fff",
  },

  erroText: {
    color: "#ff3b30",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 12,
    textAlign: "center",
  },

  forgotBtn: {
    marginBottom: 18,
  },
  forgotText: {
    color: "#4a6bff",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "right",
  },

  btn: {
    backgroundColor: "#4a6bff",
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: "center",
    elevation: 2,
  },
  btnDisabled: {
    backgroundColor: "#9eb4ff",
  },
  btnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
});
