import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { BarChart } from "react-native-chart-kit";
import useLocationTracking from "../hooks/useLocationTracking";
import api from "../services/api";

const screenWidth = Dimensions.get("window").width - 40;

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

const chartConfigLaranja = {
  ...chartConfig,
  color: (opacity = 1) => `rgba(255, 152, 0, ${opacity})`,
};

export default function AgentDashboard() {
  const [nomeAgente, setNomeAgente] = useState("");
  const [consultasHoje, setConsultasHoje] = useState(0);
  const [multasHoje, setMultasHoje] = useState(0);
  const [multasPorDia, setMultasPorDia] = useState([]);
  const [ocorrenciasPorLocalidade, setOcorrenciasPorLocalidade] = useState([]);
  const [apreensoesTotal, setApreensoesTotal] = useState(0);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [erro, setErro] = useState("");

  const {
    ativo: localizacaoAtiva,
    erro: erroLocalizacao,
    ultimaAtualizacao,
    iniciar: iniciarLocalizacao,
    parar: pararLocalizacao,
  } = useLocationTracking();

  async function handleToggleLocalizacao(valor) {
    if (valor) {
      await iniciarLocalizacao();
    } else {
      pararLocalizacao();
    }
  }

  async function carregarDados() {
    setErro("");
    try {
      const [perfilRes, consultasRes, dashboardRes] = await Promise.all([
        api.get("/agentes/ver-perfil"),
        api.get("/consultas/resumo-hoje"),
        api.get("/ocorrencias/dashboard-agente"),
      ]);

      setNomeAgente(perfilRes.data.nome);
      setConsultasHoje(consultasRes.data.total_hoje);
      setMultasHoje(dashboardRes.data.multas_hoje);
      setMultasPorDia(dashboardRes.data.multas_por_dia);
      setOcorrenciasPorLocalidade(dashboardRes.data.ocorrencias_por_localidade);
      setApreensoesTotal(dashboardRes.data.apreensoes_total);
    } catch (err) {
      setErro(err.response?.data?.error || "Erro ao carregar dados do dashboard.");
    }
  }

  useEffect(() => {
    (async () => {
      setLoading(true);
      await carregarDados();
      setLoading(false);
    })();
  }, []);

  async function onRefresh() {
    setRefreshing(true);
    await carregarDados();
    setRefreshing(false);
  }

  const multasChartData = {
    labels: multasPorDia.map((item) => item.dia),
    datasets: [{ data: multasPorDia.map((item) => item.total) }],
  };

  const localidadesChartData = {
    labels: ocorrenciasPorLocalidade.map((item) =>
      item.local.length > 8 ? `${item.local.slice(0, 8)}…` : item.local
    ),
    datasets: [{ data: ocorrenciasPorLocalidade.map((item) => item.total) }],
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4a6bff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* HEADER */}
        <View style={styles.headerCard}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.welcome}>Bem-vindo</Text>
              <Text style={styles.name}>{nomeAgente || "Agente"}</Text>
              <Text style={styles.subtitle}>
                Sistema Integrado de Trânsito
              </Text>
            </View>

            <View style={styles.avatar}>
              <MaterialIcons name="security" size={30} color="#fff" />
            </View>
          </View>
        </View>

        {erro ? <Text style={styles.erroText}>{erro}</Text> : null}

        {/* PARTILHA DE LOCALIZAÇÃO */}
        <View style={styles.localizacaoCard}>
          <View style={styles.localizacaoRow}>
            <View style={styles.localizacaoLeft}>
              <MaterialIcons
                name="my-location"
                size={26}
                color={localizacaoAtiva ? "#0a7d14" : "#999"}
              />
              <View style={{ marginLeft: 12 }}>
                <Text style={styles.localizacaoTitulo}>
                  Partilhar localização
                </Text>
                <Text style={styles.localizacaoStatus}>
                  {localizacaoAtiva
                    ? ultimaAtualizacao
                      ? `Ativo · última atualização ${ultimaAtualizacao.toLocaleTimeString(
                          "pt-AO"
                        )}`
                      : "Ativo · aguardando primeira posição..."
                    : "Desativado"}
                </Text>
              </View>
            </View>
            <Switch
              value={localizacaoAtiva}
              onValueChange={handleToggleLocalizacao}
              trackColor={{ false: "#ccc", true: "#a5d6a7" }}
              thumbColor={localizacaoAtiva ? "#0a7d14" : "#f4f3f4"}
            />
          </View>
          {erroLocalizacao ? (
            <Text style={styles.localizacaoErro}>{erroLocalizacao}</Text>
          ) : null}
          <Text style={styles.localizacaoAviso}>
            Funciona apenas com o app aberto. Ao minimizar, o envio pausa.
          </Text>
        </View>

        {/* RESUMO */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumo do dia</Text>

          <View style={styles.cardsRow}>
            <SummaryCard
              icon="search"
              label="Consultas hoje"
              value={String(consultasHoje)}
              color="#4a6bff"
            />
            <SummaryCard
              icon="receipt-long"
              label="Multas hoje"
              value={String(multasHoje)}
              color="#ff9800"
            />
          </View>
        </View>

        {/* INDICADORES */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Indicadores (últimos 7 dias)</Text>

          <Text style={styles.chartTitle}>Multas por dia</Text>
          {multasPorDia.length > 0 ? (
            <BarChart
              data={multasChartData}
              width={screenWidth}
              height={220}
              fromZero
              chartConfig={chartConfig}
              style={styles.chart}
            />
          ) : (
            <Text style={styles.semDados}>Sem multas neste período.</Text>
          )}

          <Text style={styles.chartTitle}>Ocorrências por localidade</Text>
          {ocorrenciasPorLocalidade.length > 0 ? (
            <BarChart
              data={localidadesChartData}
              width={screenWidth}
              height={220}
              fromZero
              chartConfig={chartConfigLaranja}
              style={styles.chart}
              verticalLabelRotation={20}
            />
          ) : (
            <Text style={styles.semDados}>Sem ocorrências neste período.</Text>
          )}

          <View style={styles.apreensoesCard}>
            <MaterialIcons name="local-police" size={28} color="#4a6bff" />
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.apreensoesValor}>{apreensoesTotal}</Text>
              <Text style={styles.apreensoesLabel}>
                Apreensões registadas (últimos 7 dias)
              </Text>
            </View>
          </View>
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

/* ================== STYLES ================== */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f6ff", padding: 20 },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f6ff",
  },

  headerCard: {
    backgroundColor: "#4a6bff",
    borderRadius: 22,
    padding: 20,
    marginBottom: 20,
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

  erroText: {
    color: "#ff3b30",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 12,
    textAlign: "center",
  },

  localizacaoCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    marginBottom: 20,
  },
  localizacaoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  localizacaoLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  localizacaoTitulo: {
    fontSize: 15,
    fontWeight: "700",
  },
  localizacaoStatus: {
    fontSize: 12,
    color: "#777",
    marginTop: 2,
  },
  localizacaoErro: {
    color: "#ff3b30",
    fontSize: 12,
    marginTop: 8,
  },
  localizacaoAviso: {
    color: "#aaa",
    fontSize: 11,
    marginTop: 8,
    fontStyle: "italic",
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
  semDados: {
    color: "#999",
    fontSize: 13,
    marginBottom: 25,
    fontStyle: "italic",
  },

  apreensoesCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 18,
  },
  apreensoesValor: { fontSize: 24, fontWeight: "800" },
  apreensoesLabel: { color: "#777", fontSize: 13 },

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
