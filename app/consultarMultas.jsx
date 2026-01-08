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

export default function ConsultarMultas() {
  const [valor, setValor] = useState("");
  const [tipo, setTipo] = useState("bi"); // bi | matricula
  const [resultado, setResultado] = useState(null);

  function consultarMultas() {
    // 🔴 SIMULAÇÃO — depois liga à API
    if (valor === "123456789LA" || valor === "LD-45-89-AA") {
      setResultado({
        nome: "Carlos Manuel Silva",
        multas: [
          {
            id: 1,
            infracao: "Excesso de velocidade",
            data: "10/02/2025",
            local: "Av. 4 de Fevereiro",
            valor: 25000,
            estado: "Não paga",
          },
          {
            id: 2,
            infracao: "Estacionamento indevido",
            data: "18/01/2025",
            local: "Mutamba",
            valor: 15000,
            estado: "Paga",
          },
        ],
      });
    } else {
      setResultado("erro");
    }
  }

  const totalValor =
    resultado && resultado !== "erro"
      ? resultado.multas.reduce((s, m) => s + m.valor, 0)
      : 0;

  const totalPendentes =
    resultado && resultado !== "erro"
      ? resultado.multas.filter((m) => m.estado !== "Paga").length
      : 0;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* HEADER */}
      <View style={styles.header}>
        <MaterialIcons name="gavel" size={34} color="#ff9800" />
        <Text style={styles.title}>Consulta de Multas</Text>
        <Text style={styles.subtitle}>
          Consulte multas por condutor ou veículo
        </Text>
      </View>

      {/* SELETOR */}
      <View style={styles.switchBox}>
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
      </View>

      {/* INPUT */}
      <View style={styles.inputBox}>
        <MaterialIcons
          name={tipo === "bi" ? "credit-card" : "confirmation-number"}
          size={22}
          color="#777"
        />
        <TextInput
          placeholder={
            tipo === "bi"
              ? "Ex: 123456789LA"
              : "Ex: LD-45-89-AA"
          }
          value={valor}
          onChangeText={setValor}
          style={styles.input}
          autoCapitalize="characters"
        />
      </View>

      {/* BOTÃO */}
      <TouchableOpacity style={styles.btn} onPress={consultarMultas}>
        <MaterialIcons name="search" size={22} color="#fff" />
        <Text style={styles.btnText}>Consultar Multas</Text>
      </TouchableOpacity>

      {/* RESULTADO */}
      {resultado && resultado !== "erro" && (
        <>
          {/* RESUMO */}
          <View style={styles.summaryBox}>
            <Text style={styles.summaryTitle}>Resumo</Text>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Condutor / Veículo:</Text>
              <Text style={styles.summaryValue}>{resultado.nome}</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total de Multas:</Text>
              <Text style={styles.summaryValue}>
                {resultado.multas.length}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Pendentes:</Text>
              <Text style={[styles.summaryValue, styles.error]}>
                {totalPendentes}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Valor Total:</Text>
              <Text style={[styles.summaryValue, styles.warn]}>
                {totalValor.toLocaleString()} Kz
              </Text>
            </View>
          </View>

          {/* LISTA */}
          <View style={styles.listBox}>
            {resultado.multas.map((multa) => (
              <View key={multa.id} style={styles.multaCard}>
                <View style={styles.multaHeader}>
                  <MaterialIcons
                    name="report"
                    size={20}
                    color="#ff3b30"
                  />
                  <Text style={styles.multaTitle}>
                    {multa.infracao}
                  </Text>
                </View>

                <Text style={styles.multaText}>
                  Data: <Text style={styles.bold}>{multa.data}</Text>
                </Text>
                <Text style={styles.multaText}>
                  Local: <Text style={styles.bold}>{multa.local}</Text>
                </Text>
                <Text style={styles.multaText}>
                  Valor:{" "}
                  <Text style={styles.bold}>
                    {multa.valor.toLocaleString()} Kz
                  </Text>
                </Text>

                <View
                  style={[
                    styles.statusBadge,
                    multa.estado === "Paga"
                      ? styles.paid
                      : styles.unpaid,
                  ]}
                >
                  <Text style={styles.statusText}>{multa.estado}</Text>
                </View>
              </View>
            ))}
          </View>
        </>
      )}

      {/* ERRO */}
      {resultado === "erro" && (
        <View style={styles.errorBox}>
          <MaterialIcons name="error-outline" size={24} color="#ff3b30" />
          <Text style={styles.errorText}>
            Nenhuma multa encontrada
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
    backgroundColor: "#aab6ff",
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

  listBox: {
    marginBottom: 30,
  },
  multaCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  multaHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  multaTitle: {
    fontWeight: "700",
    marginLeft: 8,
  },
  multaText: {
    fontSize: 13,
    color: "#555",
  },
  bold: {
    fontWeight: "700",
  },

  statusBadge: {
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
  paid: {
    backgroundColor: "#0a7d14",
  },
  unpaid: {
    backgroundColor: "#ff3b30",
  },

  warn: {
    color: "#ff9800",
  },
  error: {
    color: "#ff3b30",
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
