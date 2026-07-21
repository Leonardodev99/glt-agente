import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import api from "../services/api";
import { abrirDocumentoExterno, buscarDocumento } from "../utils/documentUtils";

// "Válida" ou "Expirada", calculado a partir de data_validade_carta
function calcularEstado(dataValidade) {
  if (!dataValidade) return null;
  const hoje = new Date();
  const validade = new Date(dataValidade);
  return validade >= hoje ? "Válida" : "Expirada";
}

function formatarData(iso) {
  if (!iso) return "—";
  return String(iso).split("T")[0];
}

export default function ConsultarCarta() {
  const [numeroCarta, setNumeroCarta] = useState("");
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  const [imagemBase64, setImagemBase64] = useState(null);
  const [carregandoImagem, setCarregandoImagem] = useState(false);
  const [documentoPdf, setDocumentoPdf] = useState(null);

  async function consultarCarta() {
    setErro("");
    setResultado(null);
    setImagemBase64(null);
    setDocumentoPdf(null);

    if (!numeroCarta.trim()) {
      setErro("Informe o número da carta de condução.");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/condutores/buscar-por-carta", {
        num_carta: numeroCarta.trim(),
      });
      setResultado(response.data);

      if (response.data.tem_file_carta) {
        carregarImagemCarta(numeroCarta.trim());
      }
    } catch (err) {
      setErro(err.response?.data?.error || "Carta de Condução não encontrada.");
    } finally {
      setLoading(false);
    }
  }

  async function carregarImagemCarta(numCartaConsultada) {
    setCarregandoImagem(true);
    try {
      const { contentType, base64 } = await buscarDocumento(
        "/condutores/consultar-carta",
        { num_carta: numCartaConsultada }
      );

      if (contentType.includes("pdf")) {
        setDocumentoPdf({ base64, contentType });
      } else {
        setImagemBase64(`data:${contentType};base64,${base64}`);
      }
    } catch (err) {
      console.warn("Erro ao carregar imagem da carta:", err.message);
    } finally {
      setCarregandoImagem(false);
    }
  }

  async function handleAbrirPdf() {
    if (!documentoPdf) return;
    await abrirDocumentoExterno(documentoPdf.base64, documentoPdf.contentType, "carta");
  }

  const estado = resultado ? calcularEstado(resultado.data_validade_carta) : null;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* HEADER */}
      <View style={styles.header}>
        <MaterialIcons name="credit-card" size={32} color="#4a6bff" />
        <Text style={styles.title}>Consulta da Carta de Condução</Text>
        <Text style={styles.subtitle}>
          Insira o número da Carta de Condução
        </Text>
      </View>

      {/* INPUT */}
      <View style={styles.inputBox}>
        <MaterialIcons name="confirmation-number" size={22} color="#777" />
        <TextInput
          placeholder="Ex: CC-987654-AN"
          value={numeroCarta}
          onChangeText={setNumeroCarta}
          style={styles.input}
          autoCapitalize="characters"
        />
      </View>

      {/* BOTÃO */}
      <TouchableOpacity style={styles.btn} onPress={consultarCarta} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <MaterialIcons name="search" size={22} color="#fff" />
            <Text style={styles.btnText}>Consultar Carta</Text>
          </>
        )}
      </TouchableOpacity>

      {/* RESULTADO */}
      {resultado && (
        <View style={styles.resultBox}>
          <Text style={styles.resultTitle}>Dados do Condutor</Text>

          <Text style={styles.label}>
            Nome: <Text style={styles.value}>{resultado.nome}</Text>
          </Text>

          <Text style={styles.label}>
            Nº da Carta: <Text style={styles.value}>{resultado.num_carta}</Text>
          </Text>

          <Text style={styles.label}>
            Validade:{" "}
            <Text style={styles.value}>
              {formatarData(resultado.data_validade_carta)}
            </Text>
          </Text>

          <Text style={styles.label}>
            Estado:{" "}
            <Text
              style={[
                styles.value,
                estado === "Válida" ? styles.ok : styles.expirada,
              ]}
            >
              {estado}
            </Text>
          </Text>

          <Text style={styles.label}>
            Telefone: <Text style={styles.value}>{resultado.telefone}</Text>
          </Text>

          {/* IMAGEM */}
          {carregandoImagem && (
            <View style={styles.previewLoading}>
              <ActivityIndicator color="#4a6bff" />
              <Text style={styles.previewText}>Carregando imagem...</Text>
            </View>
          )}

          {imagemBase64 && (
            <>
              <Image
                source={{ uri: imagemBase64 }}
                style={styles.cartaImage}
                resizeMode="contain"
              />
              <Text style={styles.previewText}>
                Visualização da Carta de Condução
              </Text>
            </>
          )}

          {documentoPdf && (
            <TouchableOpacity style={styles.pdfBtn} onPress={handleAbrirPdf}>
              <MaterialIcons name="picture-as-pdf" size={20} color="#4a6bff" />
              <Text style={styles.pdfBtnText}>Abrir arquivo da carta</Text>
            </TouchableOpacity>
          )}

          {!resultado.tem_file_carta && (
            <Text style={styles.previewText}>
              Nenhum arquivo de carta cadastrado para este condutor.
            </Text>
          )}
        </View>
      )}

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
    color: "#1e1e1e",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
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
    backgroundColor: "#4a6bff",
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

  resultBox: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
    elevation: 2,
    marginBottom: 20,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
  },

  label: {
    fontSize: 14,
    color: "#555",
    marginBottom: 4,
  },
  value: {
    fontWeight: "700",
    color: "#000",
  },

  ok: {
    color: "#0a7d14",
  },
  expirada: {
    color: "#ff3b30",
  },

  cartaImage: {
    width: "100%",
    height: 220,
    marginTop: 16,
    borderRadius: 12,
    backgroundColor: "#f0f0f0",
  },
  previewText: {
    textAlign: "center",
    marginTop: 8,
    fontSize: 12,
    color: "#777",
  },
  previewLoading: {
    alignItems: "center",
    marginTop: 16,
  },

  pdfBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#eef2ff",
    padding: 14,
    borderRadius: 14,
    marginTop: 16,
  },
  pdfBtnText: {
    color: "#4a6bff",
    fontWeight: "700",
    marginLeft: 8,
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
