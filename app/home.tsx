//app/home.tsx
import { useRouter } from "expo-router";
import { HomeScreen } from "../components/HomeScreen";

export default function HomePage() {
    const router = useRouter();
    
    return (
        <HomeScreen
            onNavigate={(page) => router.push(`/${page}` as any)}
        />
    );
}
