import { useRouter } from "expo-router";
import { useState } from "react";
import { ChatThreads } from "../components/ChatThreads";
import { Shift, User } from "../types";
//モック
const mockUser: User = {
    id: "u1",
    displayName: "平木友隆",
    department: "製造部",
    email: "tanaka@example.com"
};

export default function ChatThreadsPage() {
    const router = useRouter();
    const [shift] = useState<Shift>("1勤");
    
    return (
        <ChatThreads
            user={mockUser}
            selectedShift={shift}
            onNavigate={(page) => {
                const path = page === 'index' ? '/' : `/${page}`;
                router.push(path as any);
            }}
        />
    );
}
