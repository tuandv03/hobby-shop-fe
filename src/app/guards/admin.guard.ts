import { CanMatchFn, Router } from "@angular/router";
import { inject } from "@angular/core";

export const adminGuard: CanMatchFn = () => {
  const router = inject(Router);
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  if (!isAdmin) {
    router.navigateByUrl("/");
    return false;
  }
  return true;
};
