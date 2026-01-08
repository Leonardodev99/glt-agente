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

export default function ConsultarVeiculo() {
  const [matricula, setMatricula] = useState("");
  const [resultado, setResultado] = useState(null);

  function consultarVeiculo() {
    // 🔴 SIMULAÇÃO — depois liga à API real
    if (matricula === "LD-45-89-AA") {
      setResultado({
        proprietario: "Carlos Manuel Silva",
        marca: "Toyota",
        modelo: "Corolla",
        cor: "Cinza",
        ano: "2020",
        seguro: "Válido",
        inspeccao: "Válida",
        apreendido: "Não",
        imagem:
          "https://via.placeholder.com/350x220.png?text=Veículo+Registrado",
      });
    } else {
      setResultado("erro");
    }
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* HEADER */}
      <View style={styles.header}>
        <MaterialIcons name="directions-car" size={34} color="#4a6bff" />
        <Text style={styles.title}>Consulta de Veículo</Text>
        <Text style={styles.subtitle}>
          Insira o número da matrícula do veículo
        </Text>
      </View>

      {/* INPUT */}
      <View style={styles.inputBox}>
        <MaterialIcons name="confirmation-number" size={22} color="#777" />
        <TextInput
          placeholder="Ex: LD-45-89-AA"
          value={matricula}
          onChangeText={setMatricula}
          style={styles.input}
          autoCapitalize="characters"
        />
      </View>

      {/* BOTÃO */}
      <TouchableOpacity style={styles.btn} onPress={consultarVeiculo}>
        <MaterialIcons name="search" size={22} color="#fff" />
        <Text style={styles.btnText}>Consultar Veículo</Text>
      </TouchableOpacity>

      {/* RESULTADO */}
      {resultado && resultado !== "erro" && (
        <View style={styles.resultBox}>
          <Text style={styles.resultTitle}>Dados do Veículo</Text>

          <Text style={styles.label}>
            Proprietário:{" "}
            <Text style={styles.value}>{resultado.proprietario}</Text>
          </Text>

          <Text style={styles.label}>
            Marca: <Text style={styles.value}>{resultado.marca}</Text>
          </Text>

          <Text style={styles.label}>
            Modelo: <Text style={styles.value}>{resultado.modelo}</Text>
          </Text>

          <Text style={styles.label}>
            Cor: <Text style={styles.value}>{resultado.cor}</Text>
          </Text>

          <Text style={styles.label}>
            Ano: <Text style={styles.value}>{resultado.ano}</Text>
          </Text>

          <Text style={styles.label}>
            Seguro:{" "}
            <Text
              style={[
                styles.value,
                resultado.seguro === "Válido"
                  ? styles.ok
                  : styles.error,
              ]}
            >
              {resultado.seguro}
            </Text>
          </Text>

          <Text style={styles.label}>
            Inspeção:{" "}
            <Text
              style={[
                styles.value,
                resultado.inspeccao === "Válida"
                  ? styles.ok
                  : styles.error,
              ]}
            >
              {resultado.inspeccao}
            </Text>
          </Text>

          <Text style={styles.label}>
            Apreendido:{" "}
            <Text
              style={[
                styles.value,
                resultado.apreendido === "Não"
                  ? styles.ok
                  : styles.error,
              ]}
            >
              {resultado.apreendido}
            </Text>
          </Text>

          {/* IMAGEM */}
          <Image
            source={{ uri: resultado.imagem }}
            style={styles.veiculoImage}
            resizeMode="contain"
          />

          <Text style={styles.previewText}>
            Visualização do veículo / documento
          </Text>
        </View>
      )}

      {/* ERRO */}
      {resultado === "erro" && (
        <View style={styles.errorBox}>
          <MaterialIcons name="error-outline" size={24} color="#ff3b30" />
          <Text style={styles.errorText}>
            Veículo não encontrado no sistema
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
  error: {
    color: "#ff3b30",
  },

  veiculoImage: {
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
