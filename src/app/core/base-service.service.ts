import { inject } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";

export abstract class BaseService {
  protected http = inject(HttpClient);
  private baseUrl = "https://localhost:5001/api"; // TODO: move to environment config

  // Build HttpParams from object (supports nested objects & arrays)
  private buildParams(params: any, prefix: string = ""): HttpParams {
    let httpParams = new HttpParams();

    Object.keys(params).forEach((key) => {
      const value = params[key];
      const fullKey = prefix ? `${prefix}.${key}` : key;

      if (value === null || value === undefined) {
        return;
      }

      if (Array.isArray(value)) {
        value.forEach((v) => {
          httpParams = httpParams.append(fullKey, v);
        });
      } else if (typeof value === "object") {
        httpParams = this.appendParams(httpParams, value, fullKey);
      } else {
        httpParams = httpParams.append(fullKey, value);
      }
    });

    return httpParams;
  }

  private appendParams(httpParams: HttpParams, params: any, prefix: string): HttpParams {
    Object.keys(params).forEach((key) => {
      const value = params[key];
      const fullKey = `${prefix}.${key}`;

      if (value === null || value === undefined) {
        return;
      }

      if (Array.isArray(value)) {
        value.forEach((v) => {
          httpParams = httpParams.append(fullKey, v);
        });
      } else if (typeof value === "object") {
        httpParams = this.appendParams(httpParams, value, fullKey);
      } else {
        httpParams = httpParams.append(fullKey, value);
      }
    });

    return httpParams;
  }

  protected get<T>(url: string, params?: any): Observable<T> {
    const httpParams = params ? this.buildParams(params) : undefined;
    return this.http.get<T>(`${this.baseUrl}/${url}`, { params: httpParams });
  }

  protected post<T>(url: string,  params?: any): Observable<T> {
    const httpParams = params ? this.buildParams(params) : undefined;
    return this.http.post<T>(`${this.baseUrl}/${url}`, { params: httpParams });
  }

  protected put<T>(url: string,  params?: any): Observable<T> {
    const httpParams = params ? this.buildParams(params) : undefined;
    return this.http.put<T>(`${this.baseUrl}/${url}`, { params: httpParams });
  }

  protected delete<T>(url: string, params?: any): Observable<T> {
    const httpParams = params ? this.buildParams(params) : undefined;
    return this.http.delete<T>(`${this.baseUrl}/${url}`, { params: httpParams });
  }
}
