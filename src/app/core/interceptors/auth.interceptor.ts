import { inject } from "@angular/core";
import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpErrorResponse,
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { Router } from "@angular/router";

// Angular 15+ có HttpInterceptorFn (functional style)
export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const router = inject(Router);

  // Giả sử token lưu ở localStorage
  const token = localStorage.getItem("jwt_token");

  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        console.warn("Unauthorized → chuyển hướng login");
        router.navigateByUrl("/login");
      } else if (error.status === 403) {
        console.warn("Forbidden");
      } else if (error.status >= 500) {
        console.error("Server error:", error.message);
      }
      return throwError(() => error);
    })
  );
};
