import { useLayoutEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import SettingsContextProvider from "./context/SettingsContext";
import BugReport from "./pages/BugReport";
import Editor from "./pages/Editor";
import LandingPage from "./pages/LandingPage";
import NotFound from "./pages/NotFound";
import Templates from "./pages/Templates";

export default function App() {
  return (
    <SettingsContextProvider>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <RestoreScroll />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/editor" element={<Editor />} />
          <Route path="/editor/diagrams/:id" element={<Editor />} />
          <Route path="/editor/templates/:id" element={<Editor />} />
          <Route path="/bug-report" element={<BugReport />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </SettingsContextProvider>
  );
}

function RestoreScroll() {
  const location = useLocation();
  useLayoutEffect(() => {
    window.scroll(0, 0);
  }, [location.pathname]);
  return null;
}
