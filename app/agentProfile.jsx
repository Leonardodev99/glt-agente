import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import api from "../services/api";

export default function AgentProfile() {
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  // Edição de email
  const [editandoEmail, setEditandoEmail] = useState(false);
  const [emailForm, setEmailForm] = useState("");
  const [salvandoEmail, setSalvandoEmail] = useState(false);

  // Troca de senha
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [salvandoSenha, setSalvandoSenha] = useState(false);

  const fetchPerfil = async () => {
    setLoading(true);
    setErro("");
    try {
      const response = await api.get("/agentes/ver-perfil");
      setPerfil(response.data);
      setEmailForm(response.data.email);
    } catch (err) {
      setErro(err.response?.data?.error || "Erro ao carregar perfil.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPerfil();
  }, []);

  async function handleSalvarEmail() {
    setErro("");
    setSucesso("");
    setSalvandoEmail(true);
    try {
      const response = await api.put("/agentes/perfil-update", {
        email: emailForm,
      });
      setPerfil(response.data);
      setEditandoEmail(false);
      setSucesso("E-mail atualizado com sucesso.");
    } catch (err) {
      const data = err.response?.data;
      setErro(data?.errors ? data.errors.join(" | ") : data?.error || "Erro ao atualizar e-mail.");
    } finally {
      setSalvandoEmail(false);
    }
  }

  async function handleAlterarSenha() {
    setErro("");
    setSucesso("");

    if (!senhaAtual || !novaSenha || !confirmarSenha) {
      setErro("Preencha todos os campos de senha.");
      return;
    }
    if (novaSenha.length < 6) {
      setErro("A nova senha deve ter pelo menos 6 caracteres.");
      return;
    }
    if (novaSenha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }

    setSalvandoSenha(true);
    try {
      await api.put("/agentes/perfil-update", {
        senha: novaSenha,
        senha_atual: senhaAtual,
      });
      setSenhaAtual("");
      setNovaSenha("");
      setConfirmarSenha("");
      setSucesso("Senha alterada com sucesso.");
    } catch (err) {
      const data = err.response?.data;
      setErro(data?.errors ? data.errors.join(" | ") : data?.error || "Erro ao alterar senha.");
    } finally {
      setSalvandoSenha(false);
    }
  }

  async function handleLogout() {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    router.push("/login");
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4a6bff" />
      </View>
    );
  }

  if (!perfil) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.erroText}>{erro || "Não foi possível carregar o perfil."}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* AVATAR GENÉRICO (sem foto real no sistema ainda) */}
      <View style={styles.avatarContainer}>
        <MaterialIcons name="account-circle" size={120} color="#4a6bff" />
      </View>

      {/* NOME */}
      <Text style={styles.name}>{perfil.nome}</Text>
      <Text style={styles.role}>
        Agente de Trânsito · {perfil.status === "ativo" ? "Ativo" : "Inativo"}
      </Text>

      {erro ? <Text style={styles.erroText}>{erro}</Text> : null}
      {sucesso ? <Text style={styles.sucessoText}>{sucesso}</Text> : null}

      {/* INFORMAÇÕES */}
      <View style={styles.infoCard}>
        <InfoItem icon="badge" label="NIP" value={perfil.nip} />

        {!editandoEmail ? (
          <View style={styles.infoItem}>
            <View style={styles.iconBox}>
              <MaterialIcons name="email" size={22} color="#4a6bff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.infoLabel}>E-mail</Text>
              <Text style={styles.infoValue}>{perfil.email}</Text>
            </View>
            <TouchableOpacity onPress={() => setEditandoEmail(true)}>
              <MaterialIcons name="edit" size={20} color="#777" />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.editEmailBox}>
            <TextInput
              style={styles.input}
              value={emailForm}
              onChangeText={setEmailForm}
              placeholder="Novo e-mail"
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <View style={styles.editActions}>
              <TouchableOpacity
                style={[styles.smallBtn, styles.smallBtnPrimary]}
                onPress={handleSalvarEmail}
                disabled={salvandoEmail}
              >
                {salvandoEmail ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.smallBtnText}>Salvar</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.smallBtn, styles.smallBtnSecondary]}
                onPress={() => {
                  setEmailForm(perfil.email);
                  setEditandoEmail(false);
                }}
              >
                <Text style={styles.smallBtnTextSecondary}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* TROCA DE SENHA */}
      <View style={styles.infoCard}>
        <Text style={styles.sectionTitle}>Segurança</Text>

        <TextInput
          style={styles.input}
          placeholder="Senha atual"
          secureTextEntry
          value={senhaAtual}
          onChangeText={setSenhaAtual}
        />
        <TextInput
          style={styles.input}
          placeholder="Nova senha"
          secureTextEntry
          value={novaSenha}
          onChangeText={setNovaSenha}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirmar nova senha"
          secureTextEntry
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
        />

        <TouchableOpacity
          style={[styles.smallBtn, styles.smallBtnPrimary, { alignSelf: "stretch", marginTop: 8 }]}
          onPress={handleAlterarSenha}
          disabled={salvandoSenha}
        >
          {salvandoSenha ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.smallBtnText}>Alterar senha</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* BOTÃO LOGOUT */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <MaterialIcons name="logout" size={22} color="#fff" />
        <Text style={styles.logoutText}>Terminar Sessão</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

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

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f4f6ff",
    padding: 20,
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f6ff",
  },
  avatarContainer: {
    marginTop: 30,
    marginBottom: 8,
  },
  name: {
    fontSize: 24,
    fontWeight: "800",
    marginTop: 10,
  },
  role: {
    fontSize: 14,
    color: "#777",
    marginBottom: 20,
  },
  erroText: {
    color: "#f44336",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 12,
    textAlign: "center",
  },
  sucessoText: {
    color: "#0a7d14",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 12,
    textAlign: "center",
  },
  infoCard: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 14,
    color: "#1e1e1e",
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
  editEmailBox: {
    marginBottom: 10,
  },
  input: {
    borderWidth: 1.6,
    borderColor: "#c9d5ff",
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    fontSize: 15,
    backgroundColor: "#f9faff",
    marginBottom: 10,
  },
  editActions: {
    flexDirection: "row",
    gap: 10,
  },
  smallBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  smallBtnPrimary: {
    backgroundColor: "#4a6bff",
  },
  smallBtnSecondary: {
    backgroundColor: "#eef2ff",
  },
  smallBtnText: {
    color: "#fff",
    fontWeight: "700",
  },
  smallBtnTextSecondary: {
    color: "#4a6bff",
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
    marginTop: 10,
    marginBottom: 30,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
    marginLeft: 10,
  },
});
