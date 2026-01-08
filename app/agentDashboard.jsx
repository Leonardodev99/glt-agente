import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function AgentDashboard() {
  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.welcome}>Bem-vindo 👮‍♂️</Text>
        <Text style={styles.name}>Agente João</Text>
        <Text style={styles.subtitle}>Sistema Integrado de Trânsito</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* RESUMO */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumo do dia</Text>

          <View style={styles.cardsRow}>
            <View style={styles.card}>
              <MaterialIcons name="assignment" size={32} color="#4a6bff" />
              <Text style={styles.cardNumber}>12</Text>
              <Text style={styles.cardLabel}>Consultas</Text>
            </View>

            <View style={styles.card}>
              <MaterialIcons name="receipt-long" size={32} color="#ff9800" />
              <Text style={styles.cardNumber}>3</Text>
              <Text style={styles.cardLabel}>Multas</Text>
            </View>
          </View>
        </View>

        {/* CONSULTAS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Consultas</Text>

          <View style={styles.grid}>
            <ActionCard
              icon="badge"
              label="Bilhete de Identidade"
              onPress={() => router.push("/consultarBI")}
            />
            <ActionCard
              icon="credit-card"
              label="Carta de Condução"
              onPress={() => router.push("/consultarCarta")}
            />
            <ActionCard
              icon="directions-car"
              label="Veículo (Matrícula)"
              onPress={() => router.push("/consultarVeiculo")}
            />
            <ActionCard
              icon="gavel"
              label="Multas"
              onPress={() => router.push("/consultarMultas")}
            />
            <ActionCard
              icon="car-crash"
              label="Apreensões"
              onPress={() => router.push("/consultarApreensoes")}
            />
            <ActionCard
              icon="report"
              label="Ocorrências"
              onPress={() => router.push("/consultarOcorrencias")}
            />
          </View>
        </View>

        {/* REGISTOS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Registos</Text>

          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={() => router.push("/novaOcorrencia")}
          >
            <MaterialIcons name="note-add" size={26} color="#4a6bff" />
            <Text style={styles.secondaryText}>Registrar Ocorrência</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

/* COMPONENTE DE AÇÃO */
function ActionCard({ icon, label, onPress }) {
  return (
    <TouchableOpacity style={styles.actionCard} onPress={onPress}>
      <MaterialIcons name={icon} size={30} color="#4a6bff" />
      <Text style={styles.actionLabel}>{label}</Text>
    </TouchableOpacity>
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
  welcome: {
    fontSize: 16,
    color: "#555",
  },
  name: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1e1e1e",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },

  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 14,
    color: "#1e1e1e",
  },

  cardsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 18,
    elevation: 2,
  },
  cardNumber: {
    fontSize: 22,
    fontWeight: "700",
    marginTop: 10,
  },
  cardLabel: {
    color: "#777",
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  actionCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    alignItems: "center",
    elevation: 2,
  },
  actionLabel: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    color: "#333",
  },

  secondaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#c9d5ff",
  },
  secondaryText: {
    color: "#4a6bff",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 12,
  },
});
