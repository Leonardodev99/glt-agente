import { MaterialIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import api from "../services/api";

function formatarDataExibicao(date) {
  return date.toLocaleDateString("pt-AO");
}

function formatarDataISO(date) {
  const ano = date.getFullYear();
  const mes = String(date.getMonth() + 1).padStart(2, "0");
  const dia = String(date.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
}

function formatarDataHora(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return `${d.toLocaleDateString("pt-AO")} ${d.toLocaleTimeString("pt-AO", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}

const statusLabel = {
  pendente: "Pendente",
  sincronizado: "Sincronizada",
};

export default function ConsultarOcorrencias() {
  const [tipoBusca, setTipoBusca] = useState("data"); // data | local
  const [dataSelecionada, setDataSelecionada] = useState(new Date());
  const [mostrarPicker, setMostrarPicker] = useState(false);
  const [local, setLocal] = useState("");

  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  async function consultarOcorrencias() {
    setErro("");
    setResultado(null);

    if (tipoBusca === "local" && !local.trim()) {
      setErro("Informe a localidade a pesquisar.");
      return;
    }

    setLoading(true);
    try {
      let response;
      if (tipoBusca === "data") {
        response = await api.post("/ocorrencias/buscar-por-data", {
          data: formatarDataISO(dataSelecionada),
        });
      } else {
        response = await api.post("/ocorrencias/buscar-por-local", {
          local: local.trim(),
        });
      }

      setResultado(response.data);
    } catch (err) {
      setErro(err.response?.data?.error || "Nenhuma ocorrência encontrada.");
    } finally {
      setLoading(false);
    }
  }

  function handleChangeData(event, selecionada) {
    setMostrarPicker(Platform.OS === "ios");
    if (selecionada) {
      setDataSelecionada(selecionada);
    }
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* HEADER */}
      <View style={styles.header}>
        <MaterialIcons name="report" size={34} color="#ff9800" />
        <Text style={styles.title}>Consulta de Ocorrências</Text>
        <Text style={styles.subtitle}>
          Pesquise ocorrências por data ou localidade
        </Text>
      </View>

      {/* SELETOR */}
      <View style={styles.switchBox}>
        <TouchableOpacity
          style={[styles.switchBtn, tipoBusca === "data" && styles.switchActive]}
          onPress={() => {
            setTipoBusca("data");
            setResultado(null);
            setErro("");
          }}
        >
          <MaterialIcons name="calendar-today" size={20} color="#fff" />
          <Text style={styles.switchText}>Data</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.switchBtn, tipoBusca === "local" && styles.switchActive]}
          onPress={() => {
            setTipoBusca("local");
            setResultado(null);
            setErro("");
          }}
        >
          <MaterialIcons name="location-on" size={20} color="#fff" />
          <Text style={styles.switchText}>Localidade</Text>
        </TouchableOpacity>
      </View>

      {/* INPUT */}
      {tipoBusca === "data" ? (
        <TouchableOpacity
          style={styles.inputBox}
          onPress={() => setMostrarPicker(true)}
        >
          <MaterialIcons name="event" size={22} color="#777" />
          <Text style={styles.dateText}>
            {formatarDataExibicao(dataSelecionada)}
          </Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.inputBox}>
          <MaterialIcons name="place" size={22} color="#777" />
          <TextInput
            placeholder="Ex: Mutamba"
            value={local}
            onChangeText={setLocal}
            style={styles.input}
          />
        </View>
      )}

      {mostrarPicker && (
        <DateTimePicker
          value={dataSelecionada}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleChangeData}
          maximumDate={new Date()}
        />
      )}

      {/* BOTÃO */}
      <TouchableOpacity
        style={styles.btn}
        onPress={consultarOcorrencias}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <MaterialIcons name="search" size={22} color="#fff" />
            <Text style={styles.btnText}>Consultar Ocorrências</Text>
          </>
        )}
      </TouchableOpacity>

      {/* RESULTADOS */}
      {Array.isArray(resultado) && resultado.length === 0 && (
        <View style={styles.errorBox}>
          <MaterialIcons name="error-outline" size={24} color="#ff3b30" />
          <Text style={styles.errorText}>Nenhuma ocorrência encontrada</Text>
        </View>
      )}

      {Array.isArray(resultado) &&
        resultado.map((item) => (
          <View key={item.id_ocorrencia} style={styles.card}>
            <View style={styles.cardHeader}>
              <MaterialIcons name="warning" size={22} color="#ff9800" />
              <Text style={styles.cardTitle}>
                {item.tipo?.charAt(0).toUpperCase() + item.tipo?.slice(1)}
              </Text>
            </View>

            <Text style={styles.text}>
              Descrição: <Text style={styles.bold}>{item.descricao || "—"}</Text>
            </Text>
            <Text style={styles.text}>
              Data: <Text style={styles.bold}>{formatarDataHora(item.data_hora)}</Text>
            </Text>
            <Text style={styles.text}>
              Local: <Text style={styles.bold}>{item.localizacao}</Text>
            </Text>
            <Text style={styles.text}>
              Agente: <Text style={styles.bold}>{item.agente?.nome || "—"}</Text>
            </Text>
            {item.condutor && (
              <Text style={styles.text}>
                Condutor: <Text style={styles.bold}>{item.condutor.nome}</Text>
              </Text>
            )}
            {item.veiculo && (
              <Text style={styles.text}>
                Veículo: <Text style={styles.bold}>{item.veiculo.matricula}</Text>
              </Text>
            )}

            <View
              style={[
                styles.status,
                item.status_sincronizacao === "sincronizado"
                  ? styles.closed
                  : styles.open,
              ]}
            >
              <Text style={styles.statusText}>
                {statusLabel[item.status_sincronizacao] || item.status_sincronizacao}
              </Text>
            </View>
          </View>
        ))}

      {/* ERRO */}
      {erro && (
        <View style={styles.errorBox}>
          <MaterialIcons name="error-outline" size={24} color="#ff3b30" />
          <Text style={styles.errorText}>{erro}</Text>
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
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
  },

  switchBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  switchBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "48%",
    padding: 14,
    borderRadius: 14,
    backgroundColor: "#ffcc80",
  },
  switchActive: {
    backgroundColor: "#ff9800",
  },
  switchText: {
    color: "#fff",
    fontWeight: "700",
    marginLeft: 8,
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
  dateText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
    color: "#222",
  },

  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ff9800",
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

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  cardTitle: {
    fontWeight: "700",
    marginLeft: 8,
  },
  text: {
    fontSize: 13,
    color: "#555",
  },
  bold: {
    fontWeight: "700",
  },

  status: {
    alignSelf: "flex-end",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginTop: 8,
  },
  statusText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 12,
  },
  open: {
    backgroundColor: "#ff3b30",
  },
  closed: {
    backgroundColor: "#0a7d14",
  },

  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffeaea",
    padding: 14,
    borderRadius: 14,
    marginBottom: 20,
  },
  errorText: {
    color: "#ff3b30",
    fontWeight: "600",
    marginLeft: 8,
    flex: 1,
  },
});
