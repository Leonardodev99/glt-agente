import LoadingScreen from "./screens/LoadingScreen";

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 2000); // simulação
  }, []);

  return loading ? <LoadingScreen /> : <MainRoutes />;
}
