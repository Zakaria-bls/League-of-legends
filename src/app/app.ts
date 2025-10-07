import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChampionListComponent } from './components/champion-list/champion-list.component';

// ✅ Import des modules Material nécessaires
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    ChampionListComponent,
    MatToolbarModule,
    MatIconModule,      
    MatButtonModule    
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class AppComponent implements OnInit {
  ngOnInit() {
  }
}
