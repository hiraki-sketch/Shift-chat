import { useRouter } from "expo-router";
import { SearchPage } from "../components/SearchPage";
import { User } from "../types";

const mockUser: User = {
    id: "u1",
    displayName: "平木友隆",
    department: "製造部",
    email: "tanaka@example.com"
};

export default function Search() {
    const router = useRouter();
    
    const handleNavigate = (page: string) => {
        const path = page === 'index' ? '/' : `/${page}`;
        router.push(path as any);
    };
    
    return (
        <SearchPage
            user={mockUser}
            onNavigate={handleNavigate}
        />
    );
}
