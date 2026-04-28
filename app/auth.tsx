import { useAuth } from "@/contexts/AuthContext";
import { Redirect } from "expo-router";

export default function AuthCallbackPage() {
  const { user, loading } = useAuth();
  if (loading) return null;
  return <Redirect href={user ? "/" : "/login"} />;
}
