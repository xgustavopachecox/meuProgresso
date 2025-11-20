import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("treino", "routes/treino.tsx"),
  
  // ADICIONE ESTA NOVA LINHA
  route("dieta", "routes/dieta.tsx"),
  route("financeiro", "routes/financeiro.tsx")

] satisfies RouteConfig;