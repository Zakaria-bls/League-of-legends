import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { Champion } from '../../models/champion.model';

@Component({
  selector: 'app-champion-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatButtonModule, MatInputModule],
  templateUrl: 'champion-form.component.html',
  styleUrls: ['./champion-form.component.scss']
})
export class ChampionFormComponent implements OnInit {
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ChampionFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Champion | null
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [this.data?.name || '', Validators.required],
      title: [this.data?.title || '', Validators.required],
      key: [this.data?.key || '', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      const champion: Champion = { ...this.data, ...this.form.value };
      this.dialogRef.close(champion);
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
