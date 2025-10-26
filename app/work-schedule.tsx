import { useRouter } from "expo-router";
import { WorkSchedule } from "../components/WorkSchedule";
import { User } from "../types";

const mockUser: User = {
    id: "u1",
    displayName: "平木友隆",
    department: "製造部",
    email: "tanaka@example.com"
};

export default function WorkSchedulePage() {
    const router = useRouter();
    
    const handleNavigate = (page: string) => {
        const path = page === 'index' ? '/' : `/${page}`;
        router.push(path as any);
    };
    
    return (
        <WorkSchedule
            user={mockUser}
            onNavigate={handleNavigate}
        />
    );
}
