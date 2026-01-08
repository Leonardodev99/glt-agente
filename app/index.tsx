import { router } from "expo-router";
import { useEffect } from "react";
import LoadingScreen from "./LoadingScreen";

export default function Index() {
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("./login"); // vai para a tela de Login
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return <LoadingScreen />;
  
}
