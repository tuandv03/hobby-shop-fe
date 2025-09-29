import { Component, computed, effect, signal, inject } from "@angular/core";
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { NgIf } from "@angular/common";
import { CartService } from "./cards/cart.service";

@Component({
  selector: "app-root",
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NgIf],
  templateUrl: "./app.html",
  styleUrl: "./app.css",
})
export class App {
  private cart = inject(CartService);

  year = new Date().getFullYear();
  dark = signal<boolean>(false);
  cartCount = computed(() => this.cart.count());

  constructor() {
    this.dark.set(document.documentElement.classList.contains("dark"));
    effect(() => {
      const isDark = this.dark();
      document.documentElement.classList.toggle("dark", isDark);
      try {
        localStorage.setItem("theme", isDark ? "dark" : "light");
      } catch {}
    });
  }

  toggleTheme() {
    this.dark.update((v) => !v);
  }
}
