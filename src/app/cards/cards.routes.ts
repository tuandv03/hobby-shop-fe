import { Routes } from "@angular/router";

export const CARDS_ROUTES: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("./cards-shell.component").then((c) => c.CardsShellComponent),
    children: [
      {
        path: "",
        pathMatch: "full",
        loadComponent: () =>
          import("./cards-list.component").then((c) => c.CardsListComponent),
        data: { title: "All Cards", description: "Danh sách tất cả card." },
      },
      {
        path: "staples",
        loadComponent: () =>
          import("../pages/placeholder/placeholder.component").then(
            (c) => c.PlaceholderComponent,
          ),
        data: {
          title: "Staples",
          description: "Những lá bài staple phổ biến.",
        },
      },
      {
        path: "hot",
        loadComponent: () =>
          import("../pages/placeholder/placeholder.component").then(
            (c) => c.PlaceholderComponent,
          ),
        data: { title: "Hot Cards", description: "Các lá bài đang hot." },
      },
      {
        path: "archetypes",
        loadComponent: () =>
          import("../pages/placeholder/placeholder.component").then(
            (c) => c.PlaceholderComponent,
          ),
        data: { title: "Archetypes", description: "Danh sách archetype." },
      },
      {
        path: "archetypes/:archetypeName",
        loadComponent: () =>
          import("../pages/placeholder/placeholder.component").then(
            (c) => c.PlaceholderComponent,
          ),
        data: { title: "Archetype Detail", description: "Chi tiết archetype." },
      },
      {
        path: "sets/:setCode",
        loadComponent: () =>
          import("../pages/placeholder/placeholder.component").then(
            (c) => c.PlaceholderComponent,
          ),
        data: { title: "Set Detail", description: "Danh sách card trong set." },
      },
      {
        path: "detail/:id",
        loadComponent: () =>
          import("./card-detail/card-detail").then(
            (c) => c.CardDetailComponent,
          ),
        data: {
          title: "Chi tiết card",
          description: "Trang chi tiết card.",
        },
      },
    ],
  },
];
