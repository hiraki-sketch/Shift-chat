import { useRouter } from "expo-router";
import { ProfileSettings } from "../components/ProfileSettings";
import { User } from "../types";

const mockUser: User = {
    id: "u1",
    displayName: "平木友隆",
    department: "製造部",
    email: "tanaka@example.com"
};

export default function Profile() {
    const router = useRouter(); 
    
    const handleNavigate = (page: string) => {
        console.log('Profile: Navigating to:', page);
        const path = page === 'index' ? '/' : `/${page}`;
        console.log('Profile: Full path:', path);
         router.push(path as any);
        console.log('Navigation disabled - Expo Router not configured');
    };

    const handleLogout = () => {
        // ログアウト処理
        router.push('/login'); 
        console.log('Logout - Navigation disabled');
    };
    
    return (
        <ProfileSettings
            user={mockUser}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
        />
    );
}
