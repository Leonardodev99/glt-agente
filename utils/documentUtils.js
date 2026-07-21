import { Buffer } from "buffer";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import api from "../services/api";

/**
 * Busca um documento (imagem ou PDF) via POST, retornando o tipo de conteúdo
 * e os bytes já em base64 — útil pra exibir inline (imagem) ou salvar (PDF).
 *
 * @param {string} endpoint - ex: "/condutores/consultar-bi"
 * @param {object} body - ex: { bi: "123456789LA042" }
 */
export async function buscarDocumento(endpoint, body) {
  const response = await api.post(endpoint, body, {
    responseType: "arraybuffer",
  });

  const contentType = response.headers["content-type"] || "application/octet-stream";
  const base64 = Buffer.from(response.data).toString("base64");

  return { contentType, base64 };
}

/**
 * Salva o base64 num arquivo temporário e abre o menu nativo de "Abrir com..."
 * Útil para PDFs, que não têm um componente de visualização inline simples no RN.
 */
export async function abrirDocumentoExterno(base64, contentType, nomeArquivo = "documento") {
  const extensao = contentType.includes("pdf") ? "pdf" : "bin";
  const fileUri = `${FileSystem.cacheDirectory}${nomeArquivo}.${extensao}`;

  await FileSystem.writeAsStringAsync(fileUri, base64, {
    encoding: FileSystem.EncodingType.Base64,
  });

  const podeCompartilhar = await Sharing.isAvailableAsync();
  if (podeCompartilhar) {
    await Sharing.shareAsync(fileUri, { mimeType: contentType });
  }

  return fileUri;
}