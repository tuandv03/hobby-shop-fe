import { Routes } from "@angular/router";
import { HomePageComponent } from "./pages/home/home.component";

export const routes: Routes = [
  { path: "", component: HomePageComponent, title: "Yu-Gi-Oh! Card Shop" },
  {
    path: "cards",
    loadChildren: () =>
      import("./cards/cards.routes").then((m) => m.CARDS_ROUTES),
    title: "Cards",
  },
  {
    path: "sets",
    loadChildren: () => import("./sets/sets.routes").then((m) => m.SETS_ROUTES),
    title: "Sets",
  },
  {
    path: "cart",
    loadComponent: () =>
      import("./pages/placeholder/placeholder.component").then(
        (c) => c.PlaceholderComponent,
      ),
    data: { title: "Giỏ hàng", description: "Trang giỏ hàng sẽ sớm có." },
  },
  {
    path: "checkout",
    loadComponent: () =>
      import("./pages/placeholder/placeholder.component").then(
        (c) => c.PlaceholderComponent,
      ),
    data: {
      title: "Checkout",
      description: "Quy trình thanh toán đang phát triển.",
    },
  },
  {
    path: "orders",
    loadChildren: () =>
      import("./orders/orders.routes").then((m) => m.ORDERS_ROUTES),
    title: "Orders",
  },
  {
    path: "admin",
    loadChildren: () =>
      import("./admin/admin.routes").then((m) => m.ADMIN_ROUTES),
  },
  { path: "**", redirectTo: "" },
];
