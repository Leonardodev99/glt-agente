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

export default function ConsultarVeiculo() {
  const [matricula, setMatricula] = useState("");
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  const [imagemBase64, setImagemBase64] = useState(null);
  const [carregandoImagem, setCarregandoImagem] = useState(false);
  const [documentoPdf, setDocumentoPdf] = useState(null);

  async function consultarVeiculo() {
    setErro("");
    setResultado(null);
    setImagemBase64(null);
    setDocumentoPdf(null);

    if (!matricula.trim()) {
      setErro("Informe a matrícula do veículo.");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/veiculos/buscar-por-matricula", {
        matricula: matricula.trim(),
      });
      setResultado(response.data);

      if (response.data.tem_file_livrete) {
        carregarImagemLivrete(matricula.trim());
      }
    } catch (err) {
      setErro(err.response?.data?.error || "Veículo não encontrado no sistema.");
    } finally {
      setLoading(false);
    }
  }

  async function carregarImagemLivrete(matriculaConsultada) {
    setCarregandoImagem(true);
    try {
      const { contentType, base64 } = await buscarDocumento(
        "/veiculos/consultar-veiculo",
        { matricula: matriculaConsultada }
      );

      if (contentType.includes("pdf")) {
        setDocumentoPdf({ base64, contentType });
      } else {
        setImagemBase64(`data:${contentType};base64,${base64}`);
      }
    } catch (err) {
      console.warn("Erro ao carregar imagem do livrete:", err.message);
    } finally {
      setCarregandoImagem(false);
    }
  }

  async function handleAbrirPdf() {
    if (!documentoPdf) return;
    await abrirDocumentoExterno(documentoPdf.base64, documentoPdf.contentType, "livrete");
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* HEADER */}
      <View style={styles.header}>
        <MaterialIcons name="directions-car" size={34} color="#4a6bff" />
        <Text style={styles.title}>Consulta de Veículo</Text>
        <Text style={styles.subtitle}>
          Insira o número da matrícula do veículo
        </Text>
      </View>

      {/* INPUT */}
      <View style={styles.inputBox}>
        <MaterialIcons name="confirmation-number" size={22} color="#777" />
        <TextInput
          placeholder="Ex: LD-45-89-AA"
          value={matricula}
          onChangeText={setMatricula}
          style={styles.input}
          autoCapitalize="characters"
        />
      </View>

      {/* BOTÃO */}
      <TouchableOpacity style={styles.btn} onPress={consultarVeiculo} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <MaterialIcons name="search" size={22} color="#fff" />
            <Text style={styles.btnText}>Consultar Veículo</Text>
          </>
        )}
      </TouchableOpacity>

      {/* RESULTADO */}
      {resultado && (
        <View style={styles.resultBox}>
          <Text style={styles.resultTitle}>Dados do Veículo</Text>

          <Text style={styles.label}>
            Proprietário:{" "}
            <Text style={styles.value}>{resultado.proprietario || "—"}</Text>
          </Text>

          <Text style={styles.label}>
            Marca: <Text style={styles.value}>{resultado.marca}</Text>
          </Text>

          <Text style={styles.label}>
            Modelo: <Text style={styles.value}>{resultado.modelo}</Text>
          </Text>

          <Text style={styles.label}>
            Cor: <Text style={styles.value}>{resultado.cor}</Text>
          </Text>

          <Text style={styles.label}>
            Nº do Livrete: <Text style={styles.value}>{resultado.num_livrete}</Text>
          </Text>

          {resultado.proprietario_telefone && (
            <Text style={styles.label}>
              Telefone do proprietário:{" "}
              <Text style={styles.value}>{resultado.proprietario_telefone}</Text>
            </Text>
          )}

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
                style={styles.veiculoImage}
                resizeMode="contain"
              />
              <Text style={styles.previewText}>
                Visualização do livrete do veículo
              </Text>
            </>
          )}

          {documentoPdf && (
            <TouchableOpacity style={styles.pdfBtn} onPress={handleAbrirPdf}>
              <MaterialIcons name="picture-as-pdf" size={20} color="#4a6bff" />
              <Text style={styles.pdfBtnText}>Abrir arquivo do livrete</Text>
            </TouchableOpacity>
          )}

          {!resultado.tem_file_livrete && (
            <Text style={styles.previewText}>
              Nenhum arquivo de livrete cadastrado para este veículo.
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

  veiculoImage: {
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
