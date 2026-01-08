import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
    Animated,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    useColorScheme,
} from "react-native";

export default function NewPassword() {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const passwordValid = password.length >= 6;
  const confirmValid = password === confirm && confirm.length > 0;

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
          name="lock-reset"
          size={72}
          color={isDark ? "#9eb4ff" : "#4a6bff"}
          style={{ alignSelf: "center", marginBottom: 10 }}
        />

        <Text style={[styles.title, isDark && styles.titleDark]}>
          Criar nova senha
        </Text>

        <Text style={[styles.subtitle, isDark && styles.textDark]}>
          A sua nova senha deve ter pelo menos 6 caracteres.
        </Text>

        {/* NOVA SENHA */}
        <View
          style={[
            styles.inputWrapper,
            password.length > 0 && !passwordValid && styles.inputError,
            passwordValid && styles.inputSuccess,
            isDark && styles.inputDark,
          ]}
        >
          <MaterialIcons
            name="lock"
            size={22}
            color={passwordValid ? "#0a7d14" : "#777"}
            style={styles.icon}
          />
          <TextInput
            placeholder="Nova senha"
            placeholderTextColor={isDark ? "#aaa" : "#777"}
            secureTextEntry={!showPass}
            style={[styles.input, isDark && styles.textDark]}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPass(!showPass)}>
            <MaterialIcons
              name={showPass ? "visibility-off" : "visibility"}
              size={22}
              color={isDark ? "#aaa" : "#777"}
            />
          </TouchableOpacity>
        </View>

        {/* CONFIRMAR SENHA */}
        <View
          style={[
            styles.inputWrapper,
            confirm.length > 0 && !confirmValid && styles.inputError,
            confirmValid && styles.inputSuccess,
            isDark && styles.inputDark,
          ]}
        >
          <MaterialIcons
            name="lock-outline"
            size={22}
            color={confirmValid ? "#0a7d14" : "#777"}
            style={styles.icon}
          />
          <TextInput
            placeholder="Confirmar senha"
            placeholderTextColor={isDark ? "#aaa" : "#777"}
            secureTextEntry={!showConfirm}
            style={[styles.input, isDark && styles.textDark]}
            value={confirm}
            onChangeText={setConfirm}
          />
          <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
            <MaterialIcons
              name={showConfirm ? "visibility-off" : "visibility"}
              size={22}
              color={isDark ? "#aaa" : "#777"}
            />
          </TouchableOpacity>
        </View>

        {/* BOTÃO SALVAR */}
        <TouchableOpacity
          style={[
            styles.btn,
            !(passwordValid && confirmValid) && styles.btnDisabled,
          ]}
          disabled={!(passwordValid && confirmValid)}
          onPress={() => router.replace("/login")}
        >
          <Text style={styles.btnText}>Salvar nova senha</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

// 🎨 ESTILOS MATERIAL YOU
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
    fontSize: 30,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
    color: "#1e1e1e",
  },
  titleDark: {
    color: "#fff",
  },

  subtitle: {
    fontSize: 15,
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

  btn: {
    backgroundColor: "#4a6bff",
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 10,
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
