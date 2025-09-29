import { Routes } from "@angular/router";

export const ORDERS_ROUTES: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("../pages/placeholder/placeholder.component").then(
        (c) => c.PlaceholderComponent,
      ),
    data: { title: "Orders", description: "Danh sách đơn hàng của bạn." },
  },
  {
    path: ":id",
    loadComponent: () =>
      import("../pages/placeholder/placeholder.component").then(
        (c) => c.PlaceholderComponent,
      ),
    data: {
      title: "Order Detail",
      description: "Chi tiết đơn hàng và trạng thái.",
    },
  },
];
