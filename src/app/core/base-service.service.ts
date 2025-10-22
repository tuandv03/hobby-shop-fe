import { inject } from "@angular/core";
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { environment } from "../../environments";

export abstract class BaseService {
  protected http = inject(HttpClient);
  protected baseUrl = environment.apiBaseUrl;

  // Default headers
  protected getDefaultHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
  }

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

  // Error handler
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    
    console.error(errorMessage);
    return throwError(() => error);
  }

  // HTTP Methods
  protected get<T>(url: string, params?: any, headers?: HttpHeaders): Observable<T> {
    const httpParams = params ? this.buildParams(params) : undefined;
    const requestHeaders = headers || this.getDefaultHeaders();
    
    return this.http.get<T>(`${this.baseUrl}/${url}`, { 
      params: httpParams,
      headers: requestHeaders 
    }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  protected post<T>(url: string, body?: any, params?: any, headers?: HttpHeaders): Observable<T> {
    const httpParams = params ? this.buildParams(params) : undefined;
    const requestHeaders = headers || this.getDefaultHeaders();
    
    return this.http.post<T>(`${this.baseUrl}/${url}`, body, { 
      params: httpParams,
      headers: requestHeaders 
    }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  protected put<T>(url: string, body?: any, params?: any, headers?: HttpHeaders): Observable<T> {
    const httpParams = params ? this.buildParams(params) : undefined;
    const requestHeaders = headers || this.getDefaultHeaders();
    
    return this.http.put<T>(`${this.baseUrl}/${url}`, body, { 
      params: httpParams,
      headers: requestHeaders 
    }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  protected patch<T>(url: string, body?: any, params?: any, headers?: HttpHeaders): Observable<T> {
    const httpParams = params ? this.buildParams(params) : undefined;
    const requestHeaders = headers || this.getDefaultHeaders();
    
    return this.http.patch<T>(`${this.baseUrl}/${url}`, body, { 
      params: httpParams,
      headers: requestHeaders 
    }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  protected delete<T>(url: string, params?: any, headers?: HttpHeaders): Observable<T> {
    const httpParams = params ? this.buildParams(params) : undefined;
    const requestHeaders = headers || this.getDefaultHeaders();
    
    return this.http.delete<T>(`${this.baseUrl}/${url}`, { 
      params: httpParams,
      headers: requestHeaders 
    }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  // Utility methods
  protected buildUrl(endpoint: string, id?: string | number): string {
    return id ? `${endpoint}/${id}` : endpoint;
  }

  protected uploadFile<T>(url: string, file: File, additionalData?: any): Observable<T> {
    const formData = new FormData();
    formData.append('file', file);
    
    if (additionalData) {
      Object.keys(additionalData).forEach(key => {
        formData.append(key, additionalData[key]);
      });
    }
    
    // Don't set Content-Type for FormData, let browser set it with boundary
    const headers = new HttpHeaders({
      'Accept': 'application/json'
    });
    
    return this.http.post<T>(`${this.baseUrl}/${url}`, formData, { headers }).pipe(
      catchError(this.handleError.bind(this))
    );
  }
}
