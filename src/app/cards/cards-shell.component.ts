import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";

@Component({
  standalone: true,
  selector: "app-cards-shell",
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="container mx-auto max-w-7xl px-4 py-6">
      <nav class="flex flex-wrap gap-2 mb-6">
        <a
          routerLink="/cards"
          routerLinkActive="bg-primary text-primaryForeground"
          class="btn"
          >All</a
        >
        <a
          routerLink="/cards/staples"
          routerLinkActive="bg-primary text-primaryForeground"
          class="btn"
          >Staples</a
        >
        <a
          routerLink="/cards/archetypes"
          routerLinkActive="bg-primary text-primaryForeground"
          class="btn"
          >Archetypes</a
        >
        <a
          routerLink="/cards/by-set"
          routerLinkActive="bg-primary text-primaryForeground"
          class="btn"
          >By Set</a
        >
      </nav>
      <router-outlet></router-outlet>
    </div>
  `,
})
export class CardsShellComponent {}
