  import { createRoot } from "react-dom/client";
  import { GoogleOAuthProvider } from "@react-oauth/google";
  import App from "./app/App.tsx";
  import "./styles/index.css";

  createRoot(document.getElementById("root")!).render(
    <GoogleOAuthProvider clientId="322543435047-avhj92akciptrms4sd6sqju7ipr75ru8.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
  );
  