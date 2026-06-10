import { Routes } from "@angular/router";

export const SETS_ROUTES: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("./set-browser/set-browser").then((c) => c.SetBrowserComponent),
    data: {
      title: "Danh sách set",
      description: "Danh sách các set Yu-Gi-Oh!.",
    },
  },
  {
    path: ":setCode",
    loadComponent: () =>
      import("./set-browser/set-browser").then((c) => c.SetBrowserComponent),
    data: {
      title: "Set Detail",
      description: "Chi tiết set và danh sách card.",
    },
  },
];
