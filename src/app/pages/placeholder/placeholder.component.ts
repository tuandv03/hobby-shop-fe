import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-placeholder",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mx-auto max-w-3xl px-4 py-16 text-center">
      <h1 class="font-display text-3xl md:text-4xl font-semibold">
        {{ title }}
      </h1>
      <p class="mt-3 text-mutedForeground">{{ description }}</p>
      <div class="mt-8 card p-6">
        <p class="text-sm text-mutedForeground">
          Trang này đang trong quá trình hoàn thiện. Hãy tiếp tục yêu cầu để xây
          dựng tiếp nội dung.
        </p>
      </div>
    </div>
  `,
})
export class PlaceholderComponent {
  @Input() title = "Đang phát triển";
  @Input() description = "Nội dung sẽ sớm có.";
}
