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

export default function ConsultarCarta() {
  const [numeroCarta, setNumeroCarta] = useState("");
  const [resultado, setResultado] = useState(null);

  function consultarCarta() {
    // 🔴 SIMULAÇÃO — depois liga à API real
    if (numeroCarta === "CC-987654-AN") {
      setResultado({
        nome: "Carlos Manuel Silva",
        categoria: "B",
        emissao: "15/08/2018",
        validade: "15/08/2028",
        estado: "Válida",
        cartaImagem:
          "https://via.placeholder.com/350x220.png?text=Carta+de+Condução",
      });
    } else {
      setResultado("erro");
    }
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* HEADER */}
      <View style={styles.header}>
        <MaterialIcons name="credit-card" size={32} color="#4a6bff" />
        <Text style={styles.title}>Consulta da Carta de Condução</Text>
        <Text style={styles.subtitle}>
          Insira o número da Carta de Condução
        </Text>
      </View>

      {/* INPUT */}
      <View style={styles.inputBox}>
        <MaterialIcons name="confirmation-number" size={22} color="#777" />
        <TextInput
          placeholder="Ex: CC-987654-AN"
          value={numeroCarta}
          onChangeText={setNumeroCarta}
          style={styles.input}
          autoCapitalize="characters"
        />
      </View>

      {/* BOTÃO */}
      <TouchableOpacity style={styles.btn} onPress={consultarCarta}>
        <MaterialIcons name="search" size={22} color="#fff" />
        <Text style={styles.btnText}>Consultar Carta</Text>
      </TouchableOpacity>

      {/* RESULTADO */}
      {resultado && resultado !== "erro" && (
        <View style={styles.resultBox}>
          <Text style={styles.resultTitle}>Dados do Condutor</Text>

          <Text style={styles.label}>
            Nome: <Text style={styles.value}>{resultado.nome}</Text>
          </Text>

          <Text style={styles.label}>
            Categoria:{" "}
            <Text style={styles.value}>{resultado.categoria}</Text>
          </Text>

          <Text style={styles.label}>
            Emissão: <Text style={styles.value}>{resultado.emissao}</Text>
          </Text>

          <Text style={styles.label}>
            Validade: <Text style={styles.value}>{resultado.validade}</Text>
          </Text>

          <Text style={styles.label}>
            Estado:{" "}
            <Text
              style={[
                styles.value,
                resultado.estado === "Válida"
                  ? styles.ok
                  : styles.expirada,
              ]}
            >
              {resultado.estado}
            </Text>
          </Text>

          {/* IMAGEM / PDF */}
          <Image
            source={{ uri: resultado.cartaImagem }}
            style={styles.cartaImage}
            resizeMode="contain"
          />

          <Text style={styles.previewText}>
            Visualização da Carta de Condução
          </Text>
        </View>
      )}

      {/* ERRO */}
      {resultado === "erro" && (
        <View style={styles.errorBox}>
          <MaterialIcons name="error-outline" size={24} color="#ff3b30" />
          <Text style={styles.errorText}>
            Carta de Condução não encontrada
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
    fontSize: 24,
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

  ok: {
    color: "#0a7d14",
  },
  expirada: {
    color: "#ff3b30",
  },

  cartaImage: {
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
