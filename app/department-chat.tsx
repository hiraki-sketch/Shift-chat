import { useRouter } from "expo-router";
import { DepartmentChat } from "../components/DepartmentChat";
import { User } from "../types";

const mockUser: User = {
    id: "u1",
    displayName: "平木友隆",
    department: "製造部",
    email: "tanaka@example.com"
};

export default function DepartmentChatPage() {
    const router = useRouter();
    
    const handleNavigate = (page: string) => {
        const path = page === 'index' ? '/' : `/${page}`;
        router.push(path as any);
    };
    
    return (
        <DepartmentChat
            user={mockUser}
            onNavigate={handleNavigate}
        />
    );
}
