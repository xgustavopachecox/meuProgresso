// ...outros imports...
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";

// AQUI ESTÁ A CORREÇÃO DA IMPORTAÇÃO
import Sidebar from "./components/Sidebar"; // <-- SEM a pasta extra no caminho

// ...o resto do seu arquivo (links, Layout) continua o mesmo...
export const links: Route.LinksFunction = () => [
  // ...
];

export function Layout({ children }: { children: React.ReactNode }) {
  // ...
  return (
    <html lang="pt-BR">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}


// A função App com o layout correto
export default function App() {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

// ...seu ErrorBoundary continua o mesmo...
export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  // ...
}