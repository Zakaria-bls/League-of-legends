import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Champion } from '../models/champion.model';
import championsData from '../../../public/data/champion_info.json'; 

@Injectable({
  providedIn: 'root'
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
  
    const champions: Champion[] = Object.values(championsData.data); 
    return { champions };
  }

  genId(champions: Champion[]): number {
    return champions.length > 0 ? Math.max(...champions.map(c => c.id)) + 1 : 1;
  }
}
