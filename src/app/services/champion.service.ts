import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Champion } from '../models/champion.model';

@Injectable({
  providedIn: 'root'
})
export class ChampionService {
  private apiUrl = 'api/champions'; 

  constructor(private http: HttpClient) {}

  getChampions(): Observable<Champion[]> {
    return this.http.get<Champion[]>(this.apiUrl);
  }

  getChampion(id: number): Observable<Champion> {
    return this.http.get<Champion>(`${this.apiUrl}/${id}`);
  }

  addChampion(champion: Champion): Observable<Champion> {
    return this.http.post<Champion>(this.apiUrl, champion);
  }

  updateChampion(champion: Champion): Observable<any> {
    return this.http.put(`${this.apiUrl}/${champion.id}`, champion);
  }

  deleteChampion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
