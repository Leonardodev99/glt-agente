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

export default function ConsultarApreensoes() {
  const [valor, setValor] = useState("");
  const [tipo, setTipo] = useState("matricula"); // matricula | bi
  const [resultado, setResultado] = useState(null);

  function consultarApreensoes() {
    // 🔴 SIMULAÇÃO — depois liga à API
    if (valor === "LD-45-89-AA" || valor === "123456789LA") {
      setResultado({
        nome: "Toyota Hilux",
        apreensoes: [
          {
            id: 1,
            motivo: "Falta de documentos",
            data: "05/02/2025",
            local: "Av. Deolinda Rodrigues",
            patio: "Pátio Central de Luanda",
            estado: "Apreendido",
          },
          {
            id: 2,
            motivo: "Condução sob efeito de álcool",
            data: "18/11/2024",
            local: "Viana",
            patio: "Pátio Viana Norte",
            estado: "Liberado",
          },
        ],
      });
    } else {
      setResultado("erro");
    }
  }

  const totalAtivas =
    resultado && resultado !== "erro"
      ? resultado.apreensoes.filter((a) => a.estado === "Apreendido").length
      : 0;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* HEADER */}
      <View style={styles.header}>
        <MaterialIcons name="car-crash" size={34} color="#e53935" />
        <Text style={styles.title}>Consulta de Apreensões</Text>
        <Text style={styles.subtitle}>
          Consulte apreensões por veículo ou condutor
        </Text>
      </View>

      {/* SELETOR */}
      <View style={styles.switchBox}>
        <TouchableOpacity
          style={[
            styles.switchBtn,
            tipo === "matricula" && styles.switchActive,
          ]}
          onPress={() => setTipo("matricula")}
        >
          <MaterialIcons name="directions-car" size={20} color="#fff" />
          <Text style={styles.switchText}>Veículo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.switchBtn,
            tipo === "bi" && styles.switchActive,
          ]}
          onPress={() => setTipo("bi")}
        >
          <MaterialIcons name="badge" size={20} color="#fff" />
          <Text style={styles.switchText}>Condutor (BI)</Text>
        </TouchableOpacity>
      </View>

      {/* INPUT */}
      <View style={styles.inputBox}>
        <MaterialIcons
          name={
            tipo === "matricula"
              ? "confirmation-number"
              : "credit-card"
          }
          size={22}
          color="#777"
        />
        <TextInput
          placeholder={
            tipo === "matricula"
              ? "Ex: LD-45-89-AA"
              : "Ex: 123456789LA"
          }
          value={valor}
          onChangeText={setValor}
          style={styles.input}
          autoCapitalize="characters"
        />
      </View>

      {/* BOTÃO */}
      <TouchableOpacity style={styles.btn} onPress={consultarApreensoes}>
        <MaterialIcons name="search" size={22} color="#fff" />
        <Text style={styles.btnText}>Consultar Apreensões</Text>
      </TouchableOpacity>

      {/* RESULTADO */}
      {resultado && resultado !== "erro" && (
        <>
          {/* RESUMO */}
          <View style={styles.summaryBox}>
            <Text style={styles.summaryTitle}>Resumo</Text>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Veículo / Condutor:</Text>
              <Text style={styles.summaryValue}>{resultado.nome}</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total de Registos:</Text>
              <Text style={styles.summaryValue}>
                {resultado.apreensoes.length}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Apreensões Ativas:</Text>
              <Text style={[styles.summaryValue, styles.error]}>
                {totalAtivas}
              </Text>
            </View>
          </View>

          {/* LISTA */}
          {resultado.apreensoes.map((item) => (
            <View key={item.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <MaterialIcons
                  name="warning"
                  size={20}
                  color="#e53935"
                />
                <Text style={styles.cardTitle}>{item.motivo}</Text>
              </View>

              <Text style={styles.text}>
                Data: <Text style={styles.bold}>{item.data}</Text>
              </Text>
              <Text style={styles.text}>
                Local: <Text style={styles.bold}>{item.local}</Text>
              </Text>
              <Text style={styles.text}>
                Pátio: <Text style={styles.bold}>{item.patio}</Text>
              </Text>

              <View
                style={[
                  styles.status,
                  item.estado === "Apreendido"
                    ? styles.active
                    : styles.released,
                ]}
              >
                <Text style={styles.statusText}>{item.estado}</Text>
              </View>
            </View>
          ))}
        </>
      )}

      {/* ERRO */}
      {resultado === "erro" && (
        <View style={styles.errorBox}>
          <MaterialIcons name="error-outline" size={24} color="#e53935" />
          <Text style={styles.errorText}>
            Nenhuma apreensão encontrada
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
    backgroundColor: "#b0b7ff",
  },
  switchActive: {
    backgroundColor: "#4a6bff",
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
    backgroundColor: "#e53935",
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

  summaryBox: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  summaryLabel: {
    color: "#555",
  },
  summaryValue: {
    fontWeight: "700",
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
  active: {
    backgroundColor: "#e53935",
  },
  released: {
    backgroundColor: "#0a7d14",
  },

  error: {
    color: "#e53935",
  },

  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffeaea",
    padding: 14,
    borderRadius: 14,
  },
  errorText: {
    color: "#e53935",
    fontWeight: "600",
    marginLeft: 8,
  },
});
