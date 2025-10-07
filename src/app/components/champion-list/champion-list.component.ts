import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { themeQuartz, colorSchemeDark } from 'ag-grid-community';
const myDarkTheme = themeQuartz.withPart(colorSchemeDark);

import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { ChampionFormComponent } from '../champion-form/champion-form.component';
import { ToastrService } from 'ngx-toastr';


import { AgGridModule } from 'ag-grid-angular';
import { ColDef, ModuleRegistry, GridApi, AllCommunityModule } from 'ag-grid-community';
ModuleRegistry.registerModules([AllCommunityModule]);

import { Champion } from '../../models/champion.model';
import { ChampionService } from '../../services/champion.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-champion-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    AgGridModule,
    MatDialogModule
  ],
  templateUrl: './champion-list.component.html',
  styleUrls: ['./champion-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ChampionListComponent implements OnInit {
  myDarkTheme = themeQuartz.withPart(colorSchemeDark);
  quickFilterText = '';
  loading = true;
  rowData: Champion[] = [];
  getRowId = (params: any) => params.data.id.toString();
  private gridApi!: GridApi<Champion>;

  columnDefs: ColDef[] = [
    { headerName: '🆔 ID', field: 'id', width: 90, sortable: true, filter: true },
    { headerName: '🏅 Nom', field: 'name', sortable: true, filter: true, flex: 1 },
    { headerName: '🎭 Titre', field: 'title', sortable: true, filter: true, flex: 1 },
    { headerName: '🔑 Clé', field: 'key', sortable: true, filter: true, width: 120 },
    {
      headerName: '⚔️ Actions',
      cellRenderer: (params: any) => {
        const div = document.createElement('div');
        div.className = 'action-buttons';
        div.innerHTML = `
        <button class="edit-btn" data-action="edit" data-id="${params.data.id}">Modifier</button>
        <button class="delete-btn-red" data-action="delete" data-id="${params.data.id}">Supprimer</button>
      `;
        return div;
      },
      width: 200
    }
  ];

  defaultColDef: ColDef = {
    resizable: true,
    sortable: true,
    filter: true,
    floatingFilter: true,
  };

  constructor(
    private championService: ChampionService,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadChampions();
  }

  /** Charger tous les champions */
  loadChampions(): void {
    this.loading = true;
    this.championService.getChampions().subscribe({
      next: (data) => {
        this.rowData = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement champions:', err);
        this.loading = false;
      }
    });
  }

  /** Initialisation AG Grid */
  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridApi.addEventListener('cellClicked', (event: any) => {
      const action = event.event.target?.dataset.action;
      if (action === 'delete') {
        this.deleteChampion(event.data.id);
      } else if (action === 'edit') {
        this.openEditDialog(event.data);
      }
    });
  }

  /** Filtre rapide */
  onQuickFilterChanged(event: any) {
    const value = event.target.value;
    if (this.gridApi) {
      this.gridApi.setGridOption('quickFilterText', value);
    }
  }


  /** Rafraîchir la liste */
  onRefresh() {
    this.loadChampions();
  }

  /** Ajouter un champion */
  openAddDialog(): void {
    const dialogRef = this.dialog.open(ChampionFormComponent, {
      width: '500px',
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.championService.addChampion(result).subscribe({
          next: (newChampion) => {
            this.rowData = [...this.rowData, newChampion];
            this.gridApi?.applyTransaction?.({ add: [newChampion] });
            this.toastr.success('Champion ajouté avec succès 🏅', 'Succès');
          },
          error: () => this.toastr.error('Erreur lors de l’ajout du champion ⚠️', 'Erreur')
        });
      }
    });
  }


  /** Modifier un champion */
  openEditDialog(champion: Champion): void {
    const dialogRef = this.dialog.open(ChampionFormComponent, {
      width: '500px',
      data: champion,
      panelClass: 'dialog-border-radius'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.championService.updateChampion(result).subscribe({
          next: () => {
            const index = this.rowData.findIndex(c => c.id === result.id);
            if (index !== -1) {
              this.rowData[index] = { ...result };
            }
            this.gridApi?.applyTransaction?.({ update: [result] });
            this.toastr.info('Champion mis à jour ⚔️', 'Modification réussie');
          },
          error: () => this.toastr.error('Erreur lors de la modification ⚠️', 'Erreur')
        });
      }
    });
  }

  /** Supprimer un champion */
  deleteChampion(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Bannir le champion ? ⚔️',
        message: 'Êtes-vous sûr de vouloir bannir ce champion ? Cette action est irréversible !'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.championService.deleteChampion(id).subscribe({
          next: () => {
            this.rowData = this.rowData.filter(c => c.id !== id);
            this.gridApi?.applyTransaction?.({ remove: this.rowData.filter(c => c.id === id) });
            this.toastr.warning('Champion banni 🛑', 'Suppression réussie');
          },
          error: () => this.toastr.error('Erreur lors de la suppression ⚠️', 'Erreur')
        });
      }
    });
  }

}
