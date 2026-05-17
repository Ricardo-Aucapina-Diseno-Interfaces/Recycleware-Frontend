import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = 'http://localhost:8080/api/usuario/login';

  private readonly logoutUrl = 'http://localhost:8080/api/logout';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post(this.apiUrl, { email, password }, { withCredentials: true });
  }

  logout(): Observable<any> {
    return this.http.post(this.logoutUrl, {}, { withCredentials: true });
  }
}
