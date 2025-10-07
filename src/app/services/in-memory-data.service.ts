import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Champion } from '../models/champion.model';
import championsData from '../../../public/data/champion_info.json'; // ✅ your file

@Injectable({
  providedIn: 'root'
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    // The champions are under championsData.data as an object, not an array
    const champions: Champion[] = Object.values(championsData.data); // ✅ flatten into array
    return { champions };
  }

  genId(champions: Champion[]): number {
    return champions.length > 0 ? Math.max(...champions.map(c => c.id)) + 1 : 1;
  }
}
