// app/index.tsx
import { useState } from "react";
import { Dashboard } from "../components/Dashboard";
import { Shift, User } from "../types";
import { useRouter } from "expo-router";

const mockUser: User = {
  id: "u1",
  displayName: "平木友隆",
  department: "製造部",
  email: "tanaka@example.com"
};

export default function Home() {
  const [shift, setShift] = useState<Shift>("1勤");
  const router = useRouter();

  return (
    <Dashboard
      user={mockUser}
      selectedShift={shift}
      onShiftChange={setShift}
      onNavigate={(page) => {
        console.log("Navigating to:", page);
        // Expo Router でページ遷移
        router.push(`/${page}`);
      }}
    />
  );
}
