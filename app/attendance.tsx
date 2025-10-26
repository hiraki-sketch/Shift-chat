import { useRouter } from "expo-router";
import { AttendanceManagement } from "../components/AttendanceManagement";
import { User } from "../types";

//モックユーザー
const mockUser: User = {
    id: "u1",
    displayName: "平木友隆",
    department: "製造部",
    email: "tomotaka@example.com"
};

export default function AttendancePage() {
    const router = useRouter();
    
    return (
        <AttendanceManagement
            user={mockUser}
            onNavigate={(page) => {
                const path = page === 'index' ? '/' : `/${page}`;
                router.push(path as any);
            }}
        />
    );
}
