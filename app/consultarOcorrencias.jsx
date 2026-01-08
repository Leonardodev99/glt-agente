import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function ConsultarOcorrencias() {
  const [tipoBusca, setTipoBusca] = useState("data"); // data | local
  const [valor, setValor] = useState("");
  const [resultado, setResultado] = useState(null);

  function consultarOcorrencias() {
    // 🔴 SIMULAÇÃO — depois ligar à API
    if (valor.length > 0) {
      setResultado([
        {
          id: 1,
          tipo: "Acidente",
          descricao: "Colisão entre dois veículos ligeiros",
          data: "12/02/2025",
          local: "Av. Revolução de Outubro",
          agente: "Agente João",
          estado: "Aberta",
        },
        {
          id: 2,
          tipo: "Infração",
          descricao: "Excesso de velocidade",
          data: "12/02/2025",
          local: "Mutamba",
          agente: "Agente Carlos",
          estado: "Resolvida",
        },
      ]);
    } else {
      setResultado("erro");
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
          style={[
            styles.switchBtn,
            tipoBusca === "data" && styles.switchActive,
          ]}
          onPress={() => setTipoBusca("data")}
        >
          <MaterialIcons name="calendar-today" size={20} color="#fff" />
          <Text style={styles.switchText}>Data</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.switchBtn,
            tipoBusca === "local" && styles.switchActive,
          ]}
          onPress={() => setTipoBusca("local")}
        >
          <MaterialIcons name="location-on" size={20} color="#fff" />
          <Text style={styles.switchText}>Localidade</Text>
        </TouchableOpacity>
      </View>

      {/* INPUT */}
      <View style={styles.inputBox}>
        <MaterialIcons
          name={tipoBusca === "data" ? "event" : "place"}
          size={22}
          color="#777"
        />
        <TextInput
          placeholder={
            tipoBusca === "data"
              ? "Ex: 12/02/2025"
              : "Ex: Mutamba"
          }
          value={valor}
          onChangeText={setValor}
          style={styles.input}
        />
      </View>

      {/* BOTÃO */}
      <TouchableOpacity style={styles.btn} onPress={consultarOcorrencias}>
        <MaterialIcons name="search" size={22} color="#fff" />
        <Text style={styles.btnText}>Consultar Ocorrências</Text>
      </TouchableOpacity>

      {/* RESULTADOS */}
      {Array.isArray(resultado) &&
        resultado.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <MaterialIcons
                name="warning"
                size={22}
                color="#ff9800"
              />
              <Text style={styles.cardTitle}>{item.tipo}</Text>
            </View>

            <Text style={styles.text}>
              Descrição:{" "}
              <Text style={styles.bold}>{item.descricao}</Text>
            </Text>
            <Text style={styles.text}>
              Data: <Text style={styles.bold}>{item.data}</Text>
            </Text>
            <Text style={styles.text}>
              Local: <Text style={styles.bold}>{item.local}</Text>
            </Text>
            <Text style={styles.text}>
              Agente: <Text style={styles.bold}>{item.agente}</Text>
            </Text>

            <View
              style={[
                styles.status,
                item.estado === "Aberta"
                  ? styles.open
                  : styles.closed,
              ]}
            >
              <Text style={styles.statusText}>{item.estado}</Text>
            </View>
          </View>
        ))}

      {/* ERRO */}
      {resultado === "erro" && (
        <View style={styles.errorBox}>
          <MaterialIcons name="error-outline" size={24} color="#ff3b30" />
          <Text style={styles.errorText}>
            Nenhuma ocorrência encontrada
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
  },
  errorText: {
    color: "#ff3b30",
    fontWeight: "600",
    marginLeft: 8,
  },
});
