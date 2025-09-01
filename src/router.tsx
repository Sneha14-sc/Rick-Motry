// src/router.tsx
import { createRouter, createRootRoute, createRoute } from "@tanstack/react-router";
import ListPage from "./pages/ListPage";
import CharacterDetails from "./pages/CharacterDetails";

// Root route
const rootRoute = createRootRoute();

// Child routes
const listRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: ListPage,
});

const detailsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/character/$id",
  component: CharacterDetails,
});

// Build the route tree
const routeTree = rootRoute.addChildren([listRoute, detailsRoute]);

// Create router
export const router = createRouter({ routeTree });

// Augment TanStack Router's types
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
