import { Routes } from "@angular/router";

export const ADMIN_ROUTES: Routes = [
  {
    path: "inventory",
    loadComponent: () =>
      import("../pages/placeholder/placeholder.component").then(
        (c) => c.PlaceholderComponent,
      ),
    data: {
      title: "Inventory (Admin)",
      description: "Trang quản lý tồn kho sẽ sớm có.",
    },
  },
  {
    path: "orders",
    loadComponent: () =>
      import("../pages/placeholder/placeholder.component").then(
        (c) => c.PlaceholderComponent,
      ),
    data: {
      title: "Quản lý đơn hàng",
      description: "Quản trị đơn hàng, trạng thái, vận chuyển.",
    },
  },
  { path: "", pathMatch: "full", redirectTo: "inventory" },
];
