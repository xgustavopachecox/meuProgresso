import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  // Rota raiz "/"
  index("routes/home.tsx"),

  // Rota "/home" (Adicionamos o { id: "home" } para diferenciar)
  route("home", "routes/home.tsx", { id: "home-page" }),

  // Outras rotas
  route("treino", "routes/treino.tsx"),
  route("dieta", "routes/dieta.tsx"),
  route("financeiro", "routes/financeiro.tsx"),

] satisfies RouteConfig;