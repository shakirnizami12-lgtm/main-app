import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

export default function Home() {
  const testLogin = async () => {
    try {
      const email = "test@gmail.com";      // 🔴 Firebase me EXIST hona chahiye
      const password = "123456";           // 🔴 same password

      const res = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      alert("✅ LOGIN SUCCESS");
      console.log("USER:", res.user);
    } catch (err) {
      alert(err.code);
      console.error(err);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <button onClick={testLogin}>
        TEST FIREBASE LOGIN
      </button>
    </div>
  );
}