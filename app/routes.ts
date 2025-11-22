import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  // Rota raiz "/"
  index("routes/home.tsx"),

  route("home", "routes/home.tsx", { id: "home-page" }),
  route("treino", "routes/treino.tsx"),
  route("dieta", "routes/dieta.tsx"),
  route("financeiro", "routes/financeiro.tsx"),
  route("progresso", "routes/progresso.tsx"),

] satisfies RouteConfig;