import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";

@Component({
  standalone: true,
  selector: "app-cards-shell",
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: "./cards-shell.html",
  styleUrls: ["./cards-shell.css"],
})
export class CardsShellComponent {}
