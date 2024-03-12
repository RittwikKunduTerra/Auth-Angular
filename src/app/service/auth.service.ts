import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, of, switchMap, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private apiUrl = 'https://api.escuelajs.co/api/v1/auth/';
  accessToken: any = ''; // Initialize accessToken
  refreshtoken : any='';
  constructor(private http: HttpClient) {}


login(email: string, password: string): Observable<any> {
  const body = { email, password };
  return this.http.post<any>(`${this.apiUrl}login`, body).pipe(
    tap((response: any) => {
      console.log(response,"response")
      this.accessToken = response.access_token;
      window.localStorage.setItem('accessToken', this.accessToken)
      window.localStorage.setItem('refreshToken', this.refreshtoken)
    })
  );
}

refreshAccessToken(): Observable<any> {

    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      return throwError('No refresh token found.');
    }

    return this.http.post<any>(`${this.apiUrl}refresh-token`, { refreshToken }).pipe(
      tap((response: any) => {
        localStorage.setItem(this.accessToken, response.access_token);
      }),
      catchError(error => {
        console.error('Failed to refresh access token:', error);
        return throwError(error);
      })
    );
  }
// getProfile(): Observable<any> {
//   this.accessToken = localStorage.getItem('accessToken')
//   const headers = new HttpHeaders({
//     'Authorization': `Bearer ${this.accessToken}`
//   });
//   console.log(this.accessToken,"accessToken")
//   return this.http.get<any>(`${this.apiUrl}profile`, { headers });
// }
getProfile(): Observable<any> {
    const accessToken = localStorage.getItem(this.accessToken);
    if (!accessToken) {
      return throwError('No access token found.');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`
    });

    return this.http.get<any>(`${this.apiUrl}profile`, { headers }).pipe(
      catchError(error => {
        if (error.status === 401) {
          return this.refreshAccessToken().pipe(
            switchMap(() => {
              
              headers.set('Authorization', `Bearer ${localStorage.getItem(this.accessToken)}`);
              return this.http.get<any>(`${this.apiUrl}profile`, { headers });
            }),
            catchError(refreshError => {
              console.error('Failed to refresh access token:', refreshError);
              return throwError(refreshError);
            })
          );
        } else {
          console.error('Failed to fetch profile data:', error);
          return throwError(error);
        }
      })
    );
  }


}



