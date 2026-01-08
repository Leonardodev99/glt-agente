import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function ConsultarBI() {
  const [bi, setBi] = useState("");
  const [resultado, setResultado] = useState(null);

  function consultarBI() {
    // 🔴 SIMULAÇÃO — depois liga à API
    if (bi === "123456789LA") {
      setResultado({
        nome: "Carlos Manuel Silva",
        nascimento: "12/04/1994",
        pai: "Manuel Silva",
        mae: "Ana Maria",
        biImagem: "https://via.placeholder.com/350x220.png?text=BI+do+Condutor",
      });
    } else {
      setResultado("erro");
    }
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* HEADER */}
      <View style={styles.header}>
        <MaterialIcons name="badge" size={32} color="#4a6bff" />
        <Text style={styles.title}>Consulta de BI</Text>
        <Text style={styles.subtitle}>
          Insira o número do Bilhete de Identidade
        </Text>
      </View>

      {/* INPUT */}
      <View style={styles.inputBox}>
        <MaterialIcons name="credit-card" size={22} color="#777" />
        <TextInput
          placeholder="Ex: 123456789LA"
          value={bi}
          onChangeText={setBi}
          style={styles.input}
          autoCapitalize="characters"
        />
      </View>

      {/* BOTÃO */}
      <TouchableOpacity style={styles.btn} onPress={consultarBI}>
        <MaterialIcons name="search" size={22} color="#fff" />
        <Text style={styles.btnText}>Consultar BI</Text>
      </TouchableOpacity>

      {/* RESULTADO */}
      {resultado && resultado !== "erro" && (
        <View style={styles.resultBox}>
          <Text style={styles.resultTitle}>Dados do Condutor</Text>

          <Text style={styles.label}>
            Nome: <Text style={styles.value}>{resultado.nome}</Text>
          </Text>
          <Text style={styles.label}>
            Data de Nascimento:{" "}
            <Text style={styles.value}>{resultado.nascimento}</Text>
          </Text>
          <Text style={styles.label}>
            Pai: <Text style={styles.value}>{resultado.pai}</Text>
          </Text>
          <Text style={styles.label}>
            Mãe: <Text style={styles.value}>{resultado.mae}</Text>
          </Text>

          {/* IMAGEM OU PDF */}
          <Image
            source={{ uri: resultado.biImagem }}
            style={styles.biImage}
            resizeMode="contain"
          />

          <Text style={styles.previewText}>
            Visualização do Bilhete de Identidade
          </Text>
        </View>
      )}

      {/* ERRO */}
      {resultado === "erro" && (
        <View style={styles.errorBox}>
          <MaterialIcons name="error-outline" size={24} color="#ff3b30" />
          <Text style={styles.errorText}>
            BI não encontrado no sistema
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

/* STYLES */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eef2ff",
    padding: 20,
  },

  header: {
    marginBottom: 25,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    marginTop: 6,
    color: "#1e1e1e",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },

  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 56,
    marginBottom: 16,
    elevation: 2,
  },
  input: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
  },

  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4a6bff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
  },
  btnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 10,
  },

  resultBox: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
    elevation: 2,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    color: "#555",
    marginBottom: 4,
  },
  value: {
    fontWeight: "700",
    color: "#000",
  },

  biImage: {
    width: "100%",
    height: 220,
    marginTop: 16,
    borderRadius: 12,
    backgroundColor: "#f0f0f0",
  },
  previewText: {
    textAlign: "center",
    marginTop: 8,
    fontSize: 12,
    color: "#777",
  },

  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffeaea",
    padding: 14,
    borderRadius: 14,
  },
  errorText: {
    color: "#ff3b30",
    fontWeight: "600",
    marginLeft: 8,
  },
});
