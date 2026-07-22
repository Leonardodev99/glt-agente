import * as Location from "expo-location";
import { useCallback, useEffect, useRef, useState } from "react";
import api from "../services/api";

/**
 * Rastreia a localização do agente em primeiro plano e envia
 * atualizações para o backend (PUT /agentes/localizacao) automaticamente.
 *
 * IMPORTANTE: só funciona com o app aberto/em primeiro plano.
 * Se o app for minimizado ou o telemóvel bloqueado, o envio pausa
 * (limitação do Expo Go — rastreamento em segundo plano exigiria
 * expo-task-manager + development build customizado).
 */
export default function useLocationTracking() {
  const [ativo, setAtivo] = useState(false);
  const [erro, setErro] = useState("");
  const [ultimaAtualizacao, setUltimaAtualizacao] = useState(null);
  const subscriptionRef = useRef(null);

  const enviarLocalizacao = useCallback(async (latitude, longitude) => {
    try {
      await api.put("/agentes/localizacao", { latitude, longitude });
      setUltimaAtualizacao(new Date());
    } catch (err) {
      console.warn("Erro ao enviar localização:", err.message);
    }
  }, []);

  const iniciar = useCallback(async () => {
    setErro("");

    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErro("Permissão de localização negada.");
      return;
    }

    try {
      subscriptionRef.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 15000, // manda no máximo a cada 15s
          distanceInterval: 30, // ou quando se mover 30m, o que vier primeiro
        },
        (posicao) => {
          enviarLocalizacao(posicao.coords.latitude, posicao.coords.longitude);
        }
      );
      setAtivo(true);
    } catch (err) {
      setErro("Não foi possível iniciar o rastreamento de localização.");
    }
  }, [enviarLocalizacao]);

  const parar = useCallback(() => {
    if (subscriptionRef.current) {
      subscriptionRef.current.remove();
      subscriptionRef.current = null;
    }
    setAtivo(false);
  }, []);

  // Garante que o watcher é removido se o componente que usa o hook desmontar
  useEffect(() => {
    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.remove();
      }
    };
  }, []);

  return { ativo, erro, ultimaAtualizacao, iniciar, parar };
}