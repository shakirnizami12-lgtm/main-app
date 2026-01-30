import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

/* 🔐 PROTECTED ROUTES */
import AdminProtectedRoute from "./components/AdminProtectedRoute";

/* layouts */
import UserLayout from "./layouts/UserLayout";
import AdminLayout from "./layouts/AdminLayout";

/* auth pages */
import Login from "./pages/Login";
import Register from "./pages/Register";

/* user pages */
import Home from "./pages/Home";
import DailyTasks from "./pages/DailyTasks";
import Withdraw from "./pages/Withdraw";
import Refer from "./pages/Refer";
import Support from "./pages/Support";

/* task pages */
import DailyCheckingPage from "./pages/DailyCheckingPage";
import Reward from "./pages/Reward";
import SpinPage from "./pages/SpinPage";
import LotteryPage from "./pages/LotteryPage";
import AppInstallPage from "./pages/AppInstallPage";
import QuizPage from "./pages/QuizPage";
import MysteryBoxPage from "./pages/MysteryBoxPage";

/* 🔢 NUMBER GUESS (USER) */
import NumberGuessPage from "./pages/NumberGuessPage";

/* admin auth */
import AdminLogin from "./pages/admin/AdminLogin";

/* admin pages (MAIN) */
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminWithdraws from "./pages/admin/AdminWithdraws";
import AdminTaskApprovals from "./pages/admin/AdminTaskApprovals";
import AdminSettings from "./pages/admin/AdminSettings";

/* admin game pages */
import AdminLottery from "./pages/admin/AdminLottery";
import AdminQuiz from "./pages/admin/AdminQuiz";
import AdminQuizQuestions from "./pages/admin/AdminQuizQuestions";
import AdminMysteryBox from "./pages/admin/AdminMysteryBox";

/* 🔢 NUMBER GUESS (ADMIN) */
import AdminNumberGuess from "./pages/admin/AdminNumberGuess";

/* admin extra */
import AdminApps from "./pages/admin/AdminApps";
import AdminAds from "./pages/admin/AdminAds";
import AdminAdsAnalytics from "./pages/admin/AdminAdsAnalytics";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminRewardSettings from "./pages/admin/AdminRewardSettings";
import AdminRewardLogs from "./pages/admin/AdminRewardLogs";
import AdminSpinSettings from "./pages/admin/AdminSpinSettings";
import AdminUserActivity from "./pages/admin/AdminUserActivity";
import AdminWithdrawHistory from "./pages/admin/AdminWithdrawHistory";
import GameControls from "./pages/admin/GameControls";
import AdminLogs from "./pages/admin/AdminLogs";

/* ================= USER PROTECTED ================= */
function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* ========= USER AUTH ========= */}
      <Route
        path="/login"
        element={user ? <Navigate to="/" replace /> : <Login />}
      />
      <Route
        path="/register"
        element={user ? <Navigate to="/" replace /> : <Register />}
      />

      {/* ========= ADMIN AUTH ========= */}
      <Route path="/admin-login" element={<AdminLogin />} />

      {/* ========= ADMIN SIDE ========= */}
      <Route
        path="/admin"
        element={
          <AdminProtectedRoute>
            <AdminLayout />
          </AdminProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="withdraws" element={<AdminWithdraws />} />
        <Route path="tasks" element={<AdminTaskApprovals />} />
        <Route path="settings" element={<AdminSettings />} />

        {/* GAMES */}
        <Route path="lottery" element={<AdminLottery />} />
        <Route path="quiz" element={<AdminQuiz />} />
        <Route path="quiz-questions" element={<AdminQuizQuestions />} />
        <Route path="mystery-box" element={<AdminMysteryBox />} />

        {/* 🔢 NUMBER GUESS (ADMIN) */}
        <Route path="number-guess" element={<AdminNumberGuess />} />

        {/* EXTRA */}
        <Route path="apps" element={<AdminApps />} />
        <Route path="ads" element={<AdminAds />} />
        <Route path="ads-analytics" element={<AdminAdsAnalytics />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="reward-settings" element={<AdminRewardSettings />} />
        <Route path="reward-logs" element={<AdminRewardLogs />} />
        <Route path="spin-settings" element={<AdminSpinSettings />} />
        <Route path="user-activity" element={<AdminUserActivity />} />
        <Route path="withdraw-history" element={<AdminWithdrawHistory />} />
        <Route path="game-controls" element={<GameControls />} />
        <Route path="logs" element={<AdminLogs />} />
      </Route>

      {/* ========= USER SIDE ========= */}
      <Route
        element={
          <PrivateRoute>
            <UserLayout />
          </PrivateRoute>
        }
      >
        <Route path="/" element={<Home />} />
        <Route path="/tasks" element={<DailyTasks />} />
        <Route path="/withdraw" element={<Withdraw />} />
        <Route path="/refer" element={<Refer />} />
        <Route path="/support" element={<Support />} />

        {/* TASK PAGES */}
        <Route path="/daily-checking" element={<DailyCheckingPage />} />
        <Route path="/reward" element={<Reward />} />
        <Route path="/spin" element={<SpinPage />} />
        <Route path="/lottery" element={<LotteryPage />} />
        <Route path="/app-install" element={<AppInstallPage />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/mystery-box" element={<MysteryBoxPage />} />

        {/* 🔢 NUMBER GUESS (USER) */}
        <Route path="/number-guess" element={<NumberGuessPage />} />
      </Route>

      {/* ========= FALLBACK ========= */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}