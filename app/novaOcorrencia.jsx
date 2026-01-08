import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function NovaOcorrencia() {
  const [tipo, setTipo] = useState("");
  const [localizacao, setLocalizacao] = useState("");
  const [descricao, setDescricao] = useState("");
  const [idCondutor, setIdCondutor] = useState("");
  const [idVeiculo, setIdVeiculo] = useState("");

  const status = "pendente";

  // 📍 LOCALIZAÇÃO AUTOMÁTICA (SIMULADA POR ENQUANTO)
  function gerarLocalizacaoSistema() {
    // Depois será substituído por GPS real
    const latitude = (-8.83 + Math.random() * 0.01).toFixed(6);
    const longitude = (13.23 + Math.random() * 0.01).toFixed(6);

    setLocalizacao(`Lat: ${latitude}, Lng: ${longitude}`);
  }

  function registrarOcorrencia() {
    if (!tipo || !localizacao || !descricao) {
      Alert.alert("Erro", "Preencha todos os campos obrigatórios.");
      return;
    }

    // ⏱️ DATA E HORA AUTOMÁTICA
    const dataHora = new Date().toISOString();

    const ocorrencia = {
      data_hora: dataHora,
      localizacao,
      tipo,
      descricao,
      status_sincronizacao: status,
      id_condutor: idCondutor ? Number(idCondutor) : null,
      id_veiculo: idVeiculo ? Number(idVeiculo) : null,
    };

    console.log("Ocorrência a enviar:", ocorrencia);

    Alert.alert(
      "Sucesso",
      "Ocorrência registrada com sucesso.\n(Localização automática do sistema)"
    );

    setTipo("");
    setLocalizacao("");
    setDescricao("");
    setIdCondutor("");
    setIdVeiculo("");
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* HEADER */}
      <View style={styles.header}>
        <MaterialIcons name="note-add" size={34} color="#ff9800" />
        <Text style={styles.title}>Nova Ocorrência</Text>
        <Text style={styles.subtitle}>
          Data, hora e localização são geradas automaticamente
        </Text>
      </View>

      <Input
        icon="warning"
        placeholder="Tipo (Multa, Acidente...)"
        value={tipo}
        onChange={setTipo}
      />

      {/* LOCALIZAÇÃO */}
      <View style={styles.inputBox}>
        <MaterialIcons name="location-on" size={22} color="#777" />
        <TextInput
          placeholder="Localização automática"
          value={localizacao}
          onChangeText={setLocalizacao}
          style={styles.input}
        />
        <TouchableOpacity onPress={gerarLocalizacaoSistema}>
          <MaterialIcons name="refresh" size={22} color="#ff9800" />
        </TouchableOpacity>
      </View>

      {/* DESCRIÇÃO */}
      <View style={[styles.inputBox, styles.textArea]}>
        <MaterialIcons name="description" size={22} color="#777" />
        <TextInput
          placeholder="Descrição detalhada da ocorrência"
          value={descricao}
          onChangeText={setDescricao}
          style={styles.input}
          multiline
        />
      </View>

      <Input
        icon="badge"
        placeholder="ID do Condutor (opcional)"
        value={idCondutor}
        onChange={setIdCondutor}
        keyboard="numeric"
      />

      <Input
        icon="directions-car"
        placeholder="ID do Veículo (opcional)"
        value={idVeiculo}
        onChange={setIdVeiculo}
        keyboard="numeric"
      />

      <TouchableOpacity style={styles.btn} onPress={registrarOcorrencia}>
        <MaterialIcons name="save" size={22} color="#fff" />
        <Text style={styles.btnText}>Registrar Ocorrência</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

/* INPUT COMPONENT */
function Input({ icon, placeholder, value, onChange, keyboard }) {
  return (
    <View style={styles.inputBox}>
      <MaterialIcons name={icon} size={22} color="#777" />
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChange}
        style={styles.input}
        keyboardType={keyboard || "default"}
      />
    </View>
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
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 56,
    marginBottom: 14,
    elevation: 2,
  },
  textArea: {
    height: 100,
    alignItems: "flex-start",
    paddingTop: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    marginLeft: 10,
  },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ff9800",
    padding: 16,
    borderRadius: 16,
    marginTop: 10,
  },
  btnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 10,
  },
});
