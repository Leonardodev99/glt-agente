import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";

import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

/* ================== DADOS DO AGENTE ================== */
const agente = {
  nome: "João Manuel",
  telefone: "+244 923 456 789",
  email: "joao.manuel@transito.gov.ao",
  foto: "https://i.pravatar.cc/300", // imagem exemplo
};

/* ================== TELA PERFIL ================== */
export default function AgentProfile() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* FOTO */}
      <View style={styles.avatarContainer}>
        <Image source={{ uri: agente.foto }} style={styles.avatar} />
      </View>

      {/* NOME */}
      <Text style={styles.name}>{agente.nome}</Text>
      <Text style={styles.role}>Agente de Trânsito</Text>

      {/* INFORMAÇÕES */}
      <View style={styles.infoCard}>
        <InfoItem icon="phone" label="Telefone" value={agente.telefone} />
        <InfoItem icon="email" label="E-mail" value={agente.email} />
      </View>

      {/* BOTÃO */}
      <TouchableOpacity 
        style={styles.logoutBtn}
        onPress={() => router.push("/login")}
         >
        <MaterialIcons name="logout" size={22} color="#fff" />
        <Text style={styles.logoutText}>Terminar Sessão</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

/* ================== COMPONENTES ================== */

function InfoItem({ icon, label, value }) {
  return (
    <View style={styles.infoItem}>
      <View style={styles.iconBox}>
        <MaterialIcons name={icon} size={22} color="#4a6bff" />
      </View>
      <View>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

/* ================== STYLES ================== */

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f4f6ff",
    padding: 20,
    alignItems: "center",
  },

  avatarContainer: {
    marginTop: 30,
    marginBottom: 16,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: "#4a6bff",
  },

  name: {
    fontSize: 24,
    fontWeight: "800",
    marginTop: 10,
  },
  role: {
    fontSize: 14,
    color: "#777",
    marginBottom: 30,
  },

  infoCard: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 30,
  },

  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#eef2ff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  infoLabel: {
    fontSize: 13,
    color: "#777",
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "700",
  },

  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f44336",
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 18,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
    marginLeft: 10,
  },
});
