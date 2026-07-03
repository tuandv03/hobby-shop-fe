import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterLink, RouterModule, Routes } from "@angular/router";

import { HomePageComponent } from "./home.component";

const routes: Routes = [
  {
    path: "",
    component: HomePageComponent,
    title: "Yu-Gi-Oh! Card Shop",
  },
];

@NgModule({
  declarations: [HomePageComponent],
  imports: [CommonModule, RouterLink, RouterModule.forChild(routes)],
})
export class HomeModule {}
