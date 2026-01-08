import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View
} from "react-native";

export default function PasswordReset({ navigation }) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [email, setEmail] = useState("");
  const [focusEmail, setFocusEmail] = useState(false);
  const [sent, setSent] = useState(false);

  function sendEmail() {
    if (!email.includes("@")) return;

    setSent(true);
    setTimeout(() => {
      setSent(false);
      navigation.goBack();
    }, 2000);
  }

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <View style={[styles.card, isDark && styles.cardDark]}>
        
        {/* BOTÃO VOLTAR */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <MaterialIcons 
            name="arrow-back" 
            size={26} 
            color={isDark ? "#fff" : "#1c2b3a"} 
          />
        </TouchableOpacity>

        <Text style={[styles.title, isDark && styles.titleDark]}>
          Recuperar Senha
        </Text>

        <Text style={[styles.sub, isDark && styles.subDark]}>
          Insira seu e-mail e enviaremos instruções.
        </Text>

        {/* INPUT EMAIL */}
        <View style={[
          styles.inputBox, 
          focusEmail && styles.inputFocused,
          isDark && styles.inputDark
        ]}>
          <MaterialIcons 
            name="email" 
            size={22} 
            color={focusEmail ? "#0066ff" : isDark ? "#bbb" : "#777"} 
            style={styles.icon}
          />
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Seu e-mail"
            placeholderTextColor={isDark ? "#999" : "#777"}
            style={[styles.input, isDark && styles.inputTextDark]}
            onFocus={() => setFocusEmail(true)}
            onBlur={() => setFocusEmail(false)}
            keyboardType="email-address"
          />
        </View>

        {/* BOTÃO ENVIAR */}
        <TouchableOpacity 
          style={[styles.btn, email.length < 5 && styles.btnDisabled]} 
          disabled={email.length < 5}
          onPress={() => router.push("/codeSent")}
        >
          <Text style={styles.btnText}>
            {sent ? "Enviado ✔" : "Enviar"}
          </Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 25,
    backgroundColor: "#e9efff",
  },
  containerDark: {
    backgroundColor: "#0f172a",
  },

  card: {
    backgroundColor: "#fff",
    padding: 30,
    borderRadius: 25,
    elevation: 6,
  },
  cardDark: {
    backgroundColor: "#1e293b",
  },

  backBtn: {
    marginBottom: 10,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1c2b3a",
    marginBottom: 5,
  },
  titleDark: {
    color: "#fff",
  },

  sub: {
    fontSize: 15,
    color: "#555",
    marginBottom: 25,
  },
  subDark: {
    color: "#ccc",
  },

  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f4ff",
    borderWidth: 1.5,
    borderColor: "#b5c7ff",
    borderRadius: 12,
    paddingHorizontal: 10,
    height: 55,
    marginBottom: 20,
  },
  inputFocused: {
    borderColor: "#0066ff",
    backgroundColor: "#e6edff",
  },
  inputDark: {
    backgroundColor: "#334155",
    borderColor: "#475569",
  },

  icon: {
    marginRight: 8,
  },

  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  inputTextDark: {
    color: "#fff",
  },

  btn: {
    backgroundColor: "#0066ff",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  btnDisabled: {
    opacity: 0.5,
  },
  btnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
});
