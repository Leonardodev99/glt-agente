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

export default function ConsultarBI() {
  const [bi, setBi] = useState("");
  const [resultado, setResultado] = useState(null); // dados do condutor
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  const [imagemBase64, setImagemBase64] = useState(null);
  const [carregandoImagem, setCarregandoImagem] = useState(false);
  const [documentoPdf, setDocumentoPdf] = useState(null); // { base64, contentType }

  async function consultarBI() {
    setErro("");
    setResultado(null);
    setImagemBase64(null);
    setDocumentoPdf(null);

    if (!bi.trim()) {
      setErro("Informe o número do BI.");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/condutores/buscar-por-bi", { bi: bi.trim() });
      setResultado(response.data);

      if (response.data.tem_file_bi) {
        carregarImagemBI(bi.trim());
      }
    } catch (err) {
      setErro(err.response?.data?.error || "BI não encontrado no sistema.");
    } finally {
      setLoading(false);
    }
  }

  async function carregarImagemBI(biConsultado) {
    setCarregandoImagem(true);
    try {
      const { contentType, base64 } = await buscarDocumento(
        "/condutores/consultar-bi",
        { bi: biConsultado }
      );

      if (contentType.includes("pdf")) {
        setDocumentoPdf({ base64, contentType });
      } else {
        setImagemBase64(`data:${contentType};base64,${base64}`);
      }
    } catch (err) {
      // Falha ao carregar a imagem não deve travar a tela — os dados já apareceram
      console.warn("Erro ao carregar imagem do BI:", err.message);
    } finally {
      setCarregandoImagem(false);
    }
  }

  async function handleAbrirPdf() {
    if (!documentoPdf) return;
    await abrirDocumentoExterno(documentoPdf.base64, documentoPdf.contentType, "bi");
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* HEADER */}
      <View style={styles.header}>
        <MaterialIcons name="badge" size={32} color="#4a6bff" />
        <Text style={styles.title}>Consulta de BI</Text>
        <Text style={styles.subtitle}>
          Insira o número do Bilhete de Identidade
        </Text>
      </View>

      {/* INPUT */}
      <View style={styles.inputBox}>
        <MaterialIcons name="credit-card" size={22} color="#777" />
        <TextInput
          placeholder="Ex: 123456789LA042"
          value={bi}
          onChangeText={setBi}
          style={styles.input}
          autoCapitalize="characters"
        />
      </View>

      {/* BOTÃO */}
      <TouchableOpacity style={styles.btn} onPress={consultarBI} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <MaterialIcons name="search" size={22} color="#fff" />
            <Text style={styles.btnText}>Consultar BI</Text>
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
            BI: <Text style={styles.value}>{resultado.bi}</Text>
          </Text>
          <Text style={styles.label}>
            Telefone: <Text style={styles.value}>{resultado.telefone}</Text>
          </Text>
          <Text style={styles.label}>
            E-mail: <Text style={styles.value}>{resultado.email}</Text>
          </Text>
          <Text style={styles.label}>
            Nº da Carta: <Text style={styles.value}>{resultado.num_carta}</Text>
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
                style={styles.biImage}
                resizeMode="contain"
              />
              <Text style={styles.previewText}>
                Visualização do Bilhete de Identidade
              </Text>
            </>
          )}

          {documentoPdf && (
            <TouchableOpacity style={styles.pdfBtn} onPress={handleAbrirPdf}>
              <MaterialIcons name="picture-as-pdf" size={20} color="#4a6bff" />
              <Text style={styles.pdfBtnText}>Abrir arquivo do BI</Text>
            </TouchableOpacity>
          )}

          {!resultado.tem_file_bi && (
            <Text style={styles.previewText}>
              Nenhum arquivo de BI cadastrado para este condutor.
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
    fontSize: 26,
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

  biImage: {
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
