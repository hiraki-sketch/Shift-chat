import { Redirect } from "expo-router";

export default function Signup() {
    // サインアップ動線を停止中
    // return <LoginScreen initialIsSignUp={true} />;
    return <Redirect href="/login" />;
}
