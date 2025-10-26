import { useRouter } from "expo-router";
import { CreateChatThread } from "../components/CreateChatThread";
import { User } from "../types";

const mockUser: User = {
    id: "u1",
    displayName: "平木友隆",
    department: "製造部",
    email: "tanaka@example.com"
};

export default function CreateChatPage() {
    const router = useRouter();
    
    return (
        <CreateChatThread
            user={mockUser}
            onNavigate={(page) => router.push(`/${page}` as any)}
        />
    );
}
