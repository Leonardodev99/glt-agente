import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { BarChart, LineChart } from "react-native-chart-kit";

/* ================== DADOS ================== */
const multas = [
  { label: "Seg", value: 2 },
  { label: "Ter", value: 1 },
  { label: "Qua", value: 3 },
  { label: "Qui", value: 0 },
  { label: "Sex", value: 4 },
];

const ocorrencias = [
  { label: "Centro", value: 5 },
  { label: "Talatona", value: 3 },
  { label: "Viana", value: 4 },
  { label: "Cacuaco", value: 2 },
];

const totalApreensoes = 12;

/* ================== GRÁFICOS (DATASETS REAIS) ================== */
const screenWidth = Dimensions.get("window").width - 40;

const multasChartData = {
  labels: multas.map((item) => item.label),
  datasets: [
    {
      data: multas.map((item) => item.value),
    },
  ],
};

const ocorrenciasChartData = {
  labels: ocorrencias.map((item) => item.label),
  datasets: [
    {
      data: ocorrencias.map((item) => item.value),
      strokeWidth: 3,
    },
  ],
};

const chartConfig = {
  backgroundGradientFrom: "#ffffff",
  backgroundGradientTo: "#ffffff",
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(74, 107, 255, ${opacity})`,
  labelColor: () => "#000",
  propsForDots: {
    r: "5",
    strokeWidth: "2",
    stroke: "#4a6bff",
  },
};

/* ================== DASHBOARD ================== */
export default function AgentDashboard() {
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <View style={styles.headerCard}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.welcome}>Bem-vindo</Text>
              <Text style={styles.name}>Agente João</Text>
              <Text style={styles.subtitle}>
                Sistema Integrado de Trânsito
              </Text>
            </View>

            <View style={styles.avatar}>
              <MaterialIcons name="security" size={30} color="#fff" />
            </View>
          </View>
        </View>

        {/* RESUMO */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumo do dia</Text>

          <View style={styles.cardsRow}>
            <SummaryCard
              icon="search"
              label="Consultas"
              value="12"
              color="#4a6bff"
            />
            <SummaryCard
              icon="receipt-long"
              label="Multas"
              value="3"
              color="#ff9800"
            />
          </View>
        </View>

        {/* INDICADORES */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Indicadores</Text>

          <Text style={styles.chartTitle}>Multas por dia</Text>
          <BarChart
            data={multasChartData}
            width={screenWidth}
            height={220}
            fromZero
            chartConfig={chartConfig}
            style={styles.chart}
          />

          <Text style={styles.chartTitle}>Ocorrências por localidade</Text>
          <LineChart
            data={ocorrenciasChartData}
            width={screenWidth}
            height={220}
            fromZero
            bezier
            chartConfig={chartConfig}
            style={styles.chart}
          />

          <Text style={styles.chartTitle}>Apreensões</Text>
          <ProgressChart
            label="Motorizadas"
            value={6}
            total={totalApreensoes}
            color="#4a6bff"
          />
          <ProgressChart
            label="Ligeiros"
            value={4}
            total={totalApreensoes}
            color="#ff9800"
          />
          <ProgressChart
            label="Pesados"
            value={2}
            total={totalApreensoes}
            color="#f44336"
          />
        </View>

        {/* CONSULTAS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Consultas</Text>

          <MenuItem
            icon="badge"
            label="Bilhete de Identidade"
            onPress={() => router.push("/consultarBI")}
          />
          <MenuItem
            icon="credit-card"
            label="Carta de Condução"
            onPress={() => router.push("/consultarCarta")}
          />
          <MenuItem
            icon="directions-car"
            label="Veículo"
            onPress={() => router.push("/consultarVeiculo")}
          />
          <MenuItem
            icon="gavel"
            label="Multas"
            onPress={() => router.push("/consultarMultas")}
          />
          <MenuItem
            icon="car-crash"
            label="Apreensões"
            onPress={() => router.push("/consultarApreensoes")}
          />
          <MenuItem
            icon="report"
            label="Ocorrências"
            onPress={() => router.push("/consultarOcorrencias")}
          />
          <MenuItem
            icon="account-circle"
            label="Perfil do Agente"
            onPress={() => router.push("/agentProfile")}
          />
        </View>

        {/* AÇÃO */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => router.push("/novaOcorrencia")}
          >
            <MaterialIcons name="note-add" size={26} color="#fff" />
            <Text style={styles.primaryText}>
              Registrar Nova Ocorrência
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

/* ================== COMPONENTES ================== */

function SummaryCard({ icon, label, value, color }) {
  return (
    <View style={[styles.summaryCard, { borderLeftColor: color }]}>
      <MaterialIcons name={icon} size={32} color={color} />
      <Text style={styles.summaryValue}>{value}</Text>
      <Text style={styles.summaryLabel}>{label}</Text>
    </View>
  );
}

function MenuItem({ icon, label, onPress }) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuLeft}>
        <View style={styles.menuIcon}>
          <MaterialIcons name={icon} size={22} color="#4a6bff" />
        </View>
        <Text style={styles.menuText}>{label}</Text>
      </View>
      <MaterialIcons name="chevron-right" size={26} color="#999" />
    </TouchableOpacity>
  );
}

function ProgressChart({ label, value, total, color }) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={styles.progressLabel}>
        {label} ({value})
      </Text>
      <View style={styles.progressBarBg}>
        <View
          style={[
            styles.progressBar,
            {
              width: `${(value / total) * 100}%`,
              backgroundColor: color,
            },
          ]}
        />
      </View>
    </View>
  );
}

/* ================== STYLES ================== */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f6ff", padding: 20 },

  headerCard: {
    backgroundColor: "#4a6bff",
    borderRadius: 22,
    padding: 20,
    marginBottom: 30,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  welcome: { color: "#dbe1ff", fontSize: 14 },
  name: { color: "#fff", fontSize: 26, fontWeight: "800" },
  subtitle: { color: "#e0e5ff", fontSize: 13 },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#3a57e8",
    alignItems: "center",
    justifyContent: "center",
  },

  section: { marginBottom: 30 },
  sectionTitle: { fontSize: 18, fontWeight: "800", marginBottom: 16 },

  cardsRow: { flexDirection: "row", justifyContent: "space-between" },
  summaryCard: {
    width: "48%",
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 18,
    borderLeftWidth: 5,
  },

  summaryValue: { fontSize: 26, fontWeight: "800" },
  summaryLabel: { color: "#777" },

  chartTitle: { fontSize: 15, fontWeight: "700", marginBottom: 10 },
  chart: { borderRadius: 18, marginBottom: 25 },

  progressLabel: { fontSize: 13, fontWeight: "700" },
  progressBarBg: {
    height: 10,
    backgroundColor: "#eee",
    borderRadius: 6,
  },
  progressBar: { height: "100%", borderRadius: 6 },

  menuItem: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  menuLeft: { flexDirection: "row", alignItems: "center" },
  menuIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#eef2ff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  menuText: { fontSize: 15, fontWeight: "700" },

  primaryBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#4a6bff",
    padding: 18,
    borderRadius: 18,
  },
  primaryText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
    marginLeft: 12,
  },
});
