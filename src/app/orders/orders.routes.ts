import { Routes } from "@angular/router";

export const ORDERS_ROUTES: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("./orders-list/orders-list").then(
        (c) => c.OrdersListComponent,
      ),
    data: { title: "Orders", description: "Danh sách đơn hàng của bạn." },
  },
  {
    path: "create",
    loadComponent: () =>
      import("./order-create/order-create").then(
        (c) => c.OrderCreateComponent,
      ),
    data: {
      title: "Create Order",
      description: "Tạo đơn hàng mới.",
    },
  },
  {
    path: ":id",
    loadComponent: () =>
      import("./order-detail/order-detail").then(
        (c) => c.OrderDetailComponent,
      ),
    data: {
      title: "Order Detail",
      description: "Chi tiết đơn hàng và trạng thái.",
    },
  },
];
