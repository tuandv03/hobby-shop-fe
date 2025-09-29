import { Routes } from "@angular/router";

export const SETS_ROUTES: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("../pages/placeholder/placeholder.component").then(
        (c) => c.PlaceholderComponent,
      ),
    data: {
      title: "Danh sách set",
      description: "Danh sách các set Yu-Gi-Oh!.",
    },
  },
  {
    path: ":setCode",
    loadComponent: () =>
      import("../pages/placeholder/placeholder.component").then(
        (c) => c.PlaceholderComponent,
      ),
    data: {
      title: "Set Detail",
      description: "Chi tiết set và danh sách card.",
    },
  },
];
