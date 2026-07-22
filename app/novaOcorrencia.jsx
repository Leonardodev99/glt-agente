import { MaterialIcons } from "@expo/vector-icons";
import * as Location from "expo-location";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import api from "../services/api";

const TIPOS_OCORRENCIA = ["Multa", "Acidente", "Apreensão", "Outras"];
const CATEGORIAS_MULTA = ["Leve", "Leve-Média", "Grave", "Muito Grave", "Gravíssima"];

// Só para exibição — a fonte da verdade é o backend (Tabela 1 - MultaController)
const FAIXA_POR_CATEGORIA = {
  Leve: "530 - 2.640 Kz",
  "Leve-Média": "2.640 - 13.200 Kz",
  Grave: "5.280 - 26.400 Kz",
  "Muito Grave": "21.120 - 105.600 Kz",
  Gravíssima: "Acima de 105.600 Kz",
};
const METODOS_PAGAMENTO = [
  { label: "Multicaixa", value: "multicaixa" },
  { label: "Dinheiro", value: "dinheiro" },
  { label: "Transferência", value: "transferencia" },
  { label: "Cartão", value: "cartao" },
];

// Mapeia o tipo mostrado na UI para o ENUM real do backend
function mapearTipoBackend(tipoUI) {
  if (tipoUI === "Multa") return "multa";
  if (tipoUI === "Apreensão") return "apreensão";
  return "outro"; // Acidente e Outras caem aqui
}

export default function NovaOcorrencia() {
  const [tipo, setTipo] = useState("");
  const [localizacao, setLocalizacao] = useState("");
  const [buscandoLocal, setBuscandoLocal] = useState(false);
  const [descricao, setDescricao] = useState("");

  // Condutor (buscado por BI)
  const [bi, setBi] = useState("");
  const [condutor, setCondutor] = useState(null); // { id_condutor, nome }
  const [buscandoCondutor, setBuscandoCondutor] = useState(false);
  const [erroCondutor, setErroCondutor] = useState("");

  // Veículo (buscado por matrícula)
  const [matricula, setMatricula] = useState("");
  const [veiculo, setVeiculo] = useState(null); // { id_veiculo, marca, modelo }
  const [buscandoVeiculo, setBuscandoVeiculo] = useState(false);
  const [erroVeiculo, setErroVeiculo] = useState("");

  // Campos extras só para Multa
  const [categoria, setCategoria] = useState("");
  const [valorKz, setValorKz] = useState("");
  const [metodoPagamento, setMetodoPagamento] = useState("multicaixa");

  const [enviando, setEnviando] = useState(false);

  /* ============== BUSCA DE CONDUTOR / VEÍCULO ============== */

  async function buscarCondutor() {
    setErroCondutor("");
    setCondutor(null);
    if (!bi.trim()) {
      setErroCondutor("Informe o BI do condutor.");
      return;
    }
    setBuscandoCondutor(true);
    try {
      const response = await api.post("/condutores/buscar-por-bi", { bi: bi.trim() });
      setCondutor({ id_condutor: response.data.id_condutor, nome: response.data.nome });
    } catch (err) {
      setErroCondutor(err.response?.data?.error || "Condutor não encontrado.");
    } finally {
      setBuscandoCondutor(false);
    }
  }

  async function buscarVeiculo() {
    setErroVeiculo("");
    setVeiculo(null);
    if (!matricula.trim()) {
      setErroVeiculo("Informe a matrícula do veículo.");
      return;
    }
    setBuscandoVeiculo(true);
    try {
      const response = await api.post("/veiculos/buscar-por-matricula", {
        matricula: matricula.trim(),
      });
      setVeiculo({
        id_veiculo: response.data.id_veiculo,
        marca: response.data.marca,
        modelo: response.data.modelo,
      });
    } catch (err) {
      setErroVeiculo(err.response?.data?.error || "Veículo não encontrado.");
    } finally {
      setBuscandoVeiculo(false);
    }
  }

  /* ============== LOCALIZAÇÃO AUTOMÁTICA (GPS) ============== */

  async function obterCoordenadas() {
    const { status: statusPermissao } =
      await Location.requestForegroundPermissionsAsync();

    if (statusPermissao !== "granted") {
      Alert.alert(
        "Permissão negada",
        "Não foi concedida permissão de localização. Será usada uma localização simulada."
      );
      return {
        latitude: -8.83 + Math.random() * 0.01,
        longitude: 13.23 + Math.random() * 0.01,
      };
    }

    try {
      const posicao = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      return {
        latitude: posicao.coords.latitude,
        longitude: posicao.coords.longitude,
      };
    } catch (error) {
      console.log("Erro ao obter GPS real:", error);
      Alert.alert(
        "Aviso",
        "Não foi possível obter a localização real (verifique o GPS). Será usada uma localização simulada."
      );
      return {
        latitude: -8.83 + Math.random() * 0.01,
        longitude: 13.23 + Math.random() * 0.01,
      };
    }
  }

  async function tentarGeocodeNativo(latitude, longitude) {
    try {
      const resultado = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (resultado && resultado.length > 0) {
        const local = resultado[0];
        const partes = [local.street, local.district, local.city || local.subregion].filter(
          Boolean
        );
        return partes.length > 0 ? partes.join(", ") : null;
      }
      return null;
    } catch (error) {
      console.log("Erro na geocodificação nativa:", error);
      return null;
    }
  }

  async function tentarGeocodeNominatim(latitude, longitude) {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
        { headers: { "Accept-Language": "pt-PT" } }
      );
      const data = await response.json();
      if (data && data.address) {
        const addr = data.address;
        const partes = [
          addr.road,
          addr.suburb || addr.neighbourhood,
          addr.city || addr.town || addr.county,
        ].filter(Boolean);
        return partes.length > 0 ? partes.join(", ") : data.display_name;
      }
      return null;
    } catch (error) {
      console.log("Erro na geocodificação Nominatim:", error);
      return null;
    }
  }

  async function obterNomeLocal(latitude, longitude) {
    if (Platform.OS === "web") {
      return await tentarGeocodeNominatim(latitude, longitude);
    }
    const nomeNativo = await tentarGeocodeNativo(latitude, longitude);
    if (nomeNativo) return nomeNativo;
    return await tentarGeocodeNominatim(latitude, longitude);
  }

  async function gerarLocalizacaoSistema() {
    setBuscandoLocal(true);
    setLocalizacao("Localizando...");
    try {
      const { latitude, longitude } = await obterCoordenadas();
      const nomeLocal = await obterNomeLocal(latitude, longitude);
      setLocalizacao(
        nomeLocal || `Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`
      );
    } catch (error) {
      console.log("Erro ao obter localização:", error);
      Alert.alert("Aviso", "Não foi possível identificar o nome do local. Tente novamente.");
      setLocalizacao("");
    } finally {
      setBuscandoLocal(false);
    }
  }

  /* ============== GERAÇÃO DE PDF ============== */

  async function gerarPDFOcorrencia({ ocorrencia, multa, pagamento }) {
    const dataFormatada = new Date(ocorrencia.data_hora).toLocaleString("pt-PT");

    const html = `
      <html>
        <head>
          <meta charset="utf-8" />
          <style>
            body { font-family: Helvetica, Arial, sans-serif; padding: 30px; color: #1c2b3a; }
            h1 { color: #ff9800; font-size: 22px; margin-bottom: 0; }
            .subtitulo { color: #666; font-size: 13px; margin-bottom: 25px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            td { padding: 10px; border-bottom: 1px solid #eee; font-size: 14px; }
            td.label { font-weight: bold; width: 40%; color: #333; }
            .referencia {
              margin-top: 25px;
              padding: 18px;
              background: #fff3e0;
              border: 1px dashed #ff9800;
              border-radius: 8px;
              text-align: center;
            }
            .referencia p { margin: 0; font-size: 13px; color: #666; }
            .referencia h2 { margin: 5px 0 0; font-size: 20px; letter-spacing: 1px; color: #ff9800; }
            .footer { margin-top: 40px; font-size: 11px; color: #999; text-align: center; }
          </style>
        </head>
        <body>
          <h1>Auto de Ocorrência</h1>
          <p class="subtitulo">Documento gerado automaticamente pelo sistema</p>

          <table>
            <tr><td class="label">Tipo</td><td>${ocorrencia.tipo}</td></tr>
            <tr><td class="label">Data e Hora</td><td>${dataFormatada}</td></tr>
            <tr><td class="label">Localização</td><td>${ocorrencia.localizacao}</td></tr>
            <tr><td class="label">Descrição</td><td>${ocorrencia.descricao}</td></tr>
            <tr><td class="label">Condutor</td><td>${condutor?.nome ?? "—"}</td></tr>
            <tr><td class="label">Veículo</td><td>${
              veiculo ? `${veiculo.marca} ${veiculo.modelo}` : "—"
            }</td></tr>
            <tr><td class="label">Status</td><td>${ocorrencia.status_sincronizacao}</td></tr>
            ${
              multa
                ? `<tr><td class="label">Categoria da Multa</td><td>${multa.categoria}</td></tr>
                   <tr><td class="label">Valor</td><td>${Number(multa.valor_kz).toLocaleString()} Kz</td></tr>`
                : ""
            }
          </table>

          ${
            pagamento
              ? `
            <div class="referencia">
              <p>Código de Referência para Pagamento</p>
              <h2>${pagamento.codigo_referencia}</h2>
            </div>
          `
              : ""
          }

          <p class="footer">Este documento não requer assinatura para ser válido como comprovativo de registo.</p>
        </body>
      </html>
    `;

    try {
      if (Platform.OS === "web") {
        await Print.printAsync({ html });
      } else {
        const { uri } = await Print.printToFileAsync({ html });
        const isSharingAvailable = await Sharing.isAvailableAsync();
        if (isSharingAvailable) {
          await Sharing.shareAsync(uri, {
            mimetype: "application/pdf",
            dialogTitle: "Ocorrência - PDF",
            UTI: "com.adobe.pdf",
          });
        } else {
          Alert.alert("PDF gerado", `Arquivo salvo em: ${uri}`);
        }
      }
    } catch (error) {
      console.log("Erro ao gerar PDF:", error);
      Alert.alert("Erro", "Não foi possível gerar o PDF da ocorrência.");
    }
  }

  /* ============== SUBMISSÃO ============== */

  function limparFormulario() {
    setTipo("");
    setLocalizacao("");
    setDescricao("");
    setBi("");
    setCondutor(null);
    setMatricula("");
    setVeiculo(null);
    setCategoria("");
    setValorKz("");
    setMetodoPagamento("multicaixa");
  }

  async function registrarOcorrencia() {
    if (!tipo || !localizacao || !descricao) {
      Alert.alert("Erro", "Preencha tipo, localização e descrição.");
      return;
    }
    if (!condutor) {
      Alert.alert("Erro", "Busque e confirme o condutor pelo BI antes de continuar.");
      return;
    }
    if (!veiculo) {
      Alert.alert("Erro", "Busque e confirme o veículo pela matrícula antes de continuar.");
      return;
    }

    const ehMulta = tipo === "Multa";

    if (ehMulta && (!categoria || !valorKz)) {
      Alert.alert("Erro", "Preencha a categoria e o valor da multa.");
      return;
    }

    setEnviando(true);

    let ocorrenciaCriada = null;
    let multaCriada = null;

    try {
      // 1) Criar a Ocorrência
      const dataHora = new Date().toISOString();
      const resOcorrencia = await api.post("/ocorrencias", {
        data_hora: dataHora,
        localizacao,
        tipo: mapearTipoBackend(tipo),
        descricao,
        status_sincronizacao: "pendente",
        id_condutor: condutor.id_condutor,
        id_veiculo: veiculo.id_veiculo,
      });
      ocorrenciaCriada = resOcorrencia.data;

      let pagamentoCriado = null;

      if (ehMulta) {
        // 2) Criar a Multa vinculada
        try {
          const resMulta = await api.post("/multas", {
            categoria,
            valor_kz: valorKz,
            id_ocorrencia: ocorrenciaCriada.id_ocorrencia,
          });
          multaCriada = resMulta.data;
        } catch (err) {
          // Ocorrência já existe, mas a Multa falhou — o agente ainda pode
          // desfazer a Ocorrência (tem permissão pra isso)
          await api.delete(`/ocorrencias/${ocorrenciaCriada.id_ocorrencia}`).catch(() => {});
          throw new Error(
            err.response?.data?.error ||
              (err.response?.data?.errors || []).join(" | ") ||
              "Erro ao registar a multa. A ocorrência foi cancelada."
          );
        }

        // 3) Criar o Pagamento (gera o código de referência real)
        try {
          const resPagamento = await api.post("/pagamentos", {
            valor_pago: valorKz,
            metodo_pagamento: metodoPagamento,
            status: "pendente",
            id_multa: multaCriada.id_multa,
          });
          pagamentoCriado = resPagamento.data;
        } catch (err) {
          // Aqui não dá pra desfazer a Multa (só admin pode apagar) —
          // avisamos claramente em vez de tentar reverter sem permissão
          Alert.alert(
            "Atenção",
            "A multa foi registada, mas houve falha ao gerar a referência de pagamento. Informe a central para acompanhamento.\n\n" +
              (err.response?.data?.error || "Erro desconhecido.")
          );
        }
      }

      Alert.alert("Sucesso", "Ocorrência registada com sucesso.");

      // PDF só para Multa ou Apreensão
      if (tipo === "Multa" || tipo === "Apreensão") {
        await gerarPDFOcorrencia({
          ocorrencia: { ...ocorrenciaCriada, tipo },
          multa: multaCriada,
          pagamento: pagamentoCriado,
        });
      }

      limparFormulario();
    } catch (err) {
      Alert.alert("Erro", err.message || "Não foi possível registar a ocorrência.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* HEADER */}
      <View style={styles.header}>
        <MaterialIcons name="note-add" size={34} color="#ff9800" />
        <Text style={styles.title}>Nova Ocorrência</Text>
        <Text style={styles.subtitle}>
          Data e hora são geradas automaticamente
        </Text>
      </View>

      <SelectInput
        icon="warning"
        placeholder="Tipo (Multa, Acidente...)"
        value={tipo}
        onChange={setTipo}
        options={TIPOS_OCORRENCIA}
      />

      {/* CONDUTOR (busca por BI) */}
      <View style={styles.inputBox}>
        <MaterialIcons name="badge" size={22} color="#777" />
        <TextInput
          placeholder="BI do condutor"
          value={bi}
          onChangeText={setBi}
          style={styles.input}
          autoCapitalize="characters"
          editable={!condutor}
        />
        <TouchableOpacity onPress={buscarCondutor} disabled={buscandoCondutor || !!condutor}>
          {buscandoCondutor ? (
            <ActivityIndicator size="small" color="#ff9800" />
          ) : condutor ? (
            <MaterialIcons name="check-circle" size={22} color="#0a7d14" />
          ) : (
            <MaterialIcons name="search" size={22} color="#ff9800" />
          )}
        </TouchableOpacity>
      </View>
      {condutor && (
        <View style={styles.confirmBox}>
          <Text style={styles.confirmText}>✔ {condutor.nome}</Text>
          <TouchableOpacity onPress={() => setCondutor(null)}>
            <Text style={styles.trocarText}>Trocar</Text>
          </TouchableOpacity>
        </View>
      )}
      {erroCondutor ? <Text style={styles.erroCampo}>{erroCondutor}</Text> : null}

      {/* VEÍCULO (busca por matrícula) */}
      <View style={styles.inputBox}>
        <MaterialIcons name="directions-car" size={22} color="#777" />
        <TextInput
          placeholder="Matrícula do veículo"
          value={matricula}
          onChangeText={setMatricula}
          style={styles.input}
          autoCapitalize="characters"
          editable={!veiculo}
        />
        <TouchableOpacity onPress={buscarVeiculo} disabled={buscandoVeiculo || !!veiculo}>
          {buscandoVeiculo ? (
            <ActivityIndicator size="small" color="#ff9800" />
          ) : veiculo ? (
            <MaterialIcons name="check-circle" size={22} color="#0a7d14" />
          ) : (
            <MaterialIcons name="search" size={22} color="#ff9800" />
          )}
        </TouchableOpacity>
      </View>
      {veiculo && (
        <View style={styles.confirmBox}>
          <Text style={styles.confirmText}>
            ✔ {veiculo.marca} {veiculo.modelo}
          </Text>
          <TouchableOpacity onPress={() => setVeiculo(null)}>
            <Text style={styles.trocarText}>Trocar</Text>
          </TouchableOpacity>
        </View>
      )}
      {erroVeiculo ? <Text style={styles.erroCampo}>{erroVeiculo}</Text> : null}

      {/* LOCALIZAÇÃO */}
      <View style={styles.inputBox}>
        <MaterialIcons name="location-on" size={22} color="#777" />
        <TextInput
          placeholder="Toque para localizar"
          value={localizacao}
          onChangeText={setLocalizacao}
          style={styles.input}
          editable={!buscandoLocal}
        />
        <TouchableOpacity onPress={gerarLocalizacaoSistema} disabled={buscandoLocal}>
          {buscandoLocal ? (
            <ActivityIndicator size="small" color="#ff9800" />
          ) : (
            <MaterialIcons name="refresh" size={22} color="#ff9800" />
          )}
        </TouchableOpacity>
      </View>

      {/* DESCRIÇÃO */}
      <View style={[styles.inputBox, styles.textArea]}>
        <MaterialIcons name="description" size={22} color="#777" />
        <TextInput
          placeholder="Descrição detalhada da ocorrência"
          value={descricao}
          onChangeText={setDescricao}
          style={styles.input}
          multiline
        />
      </View>

      {/* CAMPOS EXTRA SÓ PARA MULTA */}
      {tipo === "Multa" && (
        <>
          <SelectInput
            icon="gavel"
            placeholder="Categoria da infração"
            value={categoria}
            onChange={setCategoria}
            options={CATEGORIAS_MULTA}
          />

          {categoria ? (
            <Text style={styles.faixaHint}>
              Faixa de referência: {FAIXA_POR_CATEGORIA[categoria]}
            </Text>
          ) : null}

          <Input
            icon="payments"
            placeholder="Valor da multa (Kz)"
            value={valorKz}
            onChange={setValorKz}
            keyboard="numeric"
          />

          <SelectInput
            icon="credit-card"
            placeholder="Método de pagamento previsto"
            value={
              METODOS_PAGAMENTO.find((m) => m.value === metodoPagamento)?.label
            }
            onChange={(label) =>
              setMetodoPagamento(
                METODOS_PAGAMENTO.find((m) => m.label === label)?.value
              )
            }
            options={METODOS_PAGAMENTO.map((m) => m.label)}
          />
        </>
      )}

      <TouchableOpacity
        style={[styles.btn, enviando && styles.btnDisabled]}
        onPress={registrarOcorrencia}
        disabled={enviando}
      >
        {enviando ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <MaterialIcons name="save" size={22} color="#fff" />
            <Text style={styles.btnText}>Registrar Ocorrência</Text>
          </>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

/* INPUT COMPONENT (texto livre) */
function Input({ icon, placeholder, value, onChange, keyboard }) {
  return (
    <View style={styles.inputBox}>
      <MaterialIcons name={icon} size={22} color="#777" />
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChange}
        style={styles.input}
        keyboardType={keyboard || "default"}
      />
    </View>
  );
}

/* SELECT INPUT COMPONENT (opções fixas) */
function SelectInput({ icon, placeholder, value, onChange, options }) {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <TouchableOpacity
        style={styles.inputBox}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}
      >
        <MaterialIcons name={icon} size={22} color="#777" />
        <Text
          style={[styles.input, styles.selectText, !value && styles.selectPlaceholder]}
        >
          {value || placeholder}
        </Text>
        <MaterialIcons name="arrow-drop-down" size={24} color="#777" />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecione</Text>
            {options.map((option) => (
              <TouchableOpacity
                key={option}
                style={[styles.optionItem, value === option && styles.optionItemSelected]}
                onPress={() => {
                  onChange(option);
                  setModalVisible(false);
                }}
              >
                <Text
                  style={[styles.optionText, value === option && styles.optionTextSelected]}
                >
                  {option}
                </Text>
                {value === option && (
                  <MaterialIcons name="check" size={20} color="#ff9800" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </>
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
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 56,
    marginBottom: 14,
    elevation: 2,
  },
  textArea: {
    height: 100,
    alignItems: "flex-start",
    paddingTop: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    marginLeft: 10,
  },
  selectText: {
    color: "#333",
  },
  selectPlaceholder: {
    color: "#999",
  },
  confirmBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#e8f5e9",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginTop: -6,
    marginBottom: 14,
  },
  confirmText: {
    color: "#0a7d14",
    fontWeight: "700",
    fontSize: 13,
  },
  trocarText: {
    color: "#4a6bff",
    fontWeight: "700",
    fontSize: 13,
  },
  erroCampo: {
    color: "#ff3b30",
    fontSize: 12,
    marginTop: -8,
    marginBottom: 12,
    marginLeft: 4,
  },
  faixaHint: {
    color: "#ff9800",
    fontSize: 12,
    fontWeight: "600",
    marginTop: -8,
    marginBottom: 14,
    marginLeft: 4,
  },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ff9800",
    padding: 16,
    borderRadius: 16,
    marginTop: 10,
    marginBottom: 30,
  },
  btnDisabled: {
    backgroundColor: "#ffc98a",
  },
  btnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: 30,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
    color: "#333",
  },
  optionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  optionItemSelected: {
    backgroundColor: "#fff3e0",
  },
  optionText: {
    fontSize: 15,
    color: "#333",
  },
  optionTextSelected: {
    color: "#ff9800",
    fontWeight: "700",
  },
});
