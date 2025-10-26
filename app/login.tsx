import { useRouter } from "expo-router";
import { LoginScreen } from "../components/LoginScreen";

export default function LoginPage() {
    const router = useRouter();
    return <LoginScreen onPressLogin={() => router.push("/Homescreen")}/>;
}
