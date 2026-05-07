import { Component } from '@angular/core';
import { AdminService } from '../../../../infraestructure/services/admin.service';
import { FormsModule } from '@angular/forms';
import { DecimalPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'admin-withdraw-methods',
  standalone: true,
  imports: [
    FormsModule,
    NgFor,
    NgIf,
    MatTableModule,
    MatButtonModule,
    MatInputModule,
    DecimalPipe,
    NgClass
  ],
  templateUrl: './withdraw-methods.component.html',
  styleUrl: '../admin.css'
})
export class WithdrawMethodsComponent {
showForm = false;

cols = ['name', 'type', 'status', 'actions'];
  methods: any[] = [];

  // 🔹 form principal
  name = '';
  description = '';
  image_url = '';
  type: 'crypto' | 'bank' | 'wallet' = 'crypto';
  currency = '';
conversionRate = 0;
fee = 0;
feeType = 'percent';
isEdit = false;
editId: string | null = null;
processingTime = 0;
processingUnit = 'minutes';

minWithdraw = 0;
maxWithdraw = 0;
  // 🔥 fields dinámicos
  fields: any[] = [];

  newField: any = {
    name: '',
    label: '',
    type: 'text',
    required: false,
    options: []
  };

  constructor(private admin: AdminService) {}
file!: File;
preview: string | null = null;
  onFile(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    // 🔥 validación
    if (!file.type.startsWith('image/')) {
      alert('Solo imágenes');
      return;
    }

    this.file = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.preview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
  ngOnInit() {
    this.load();
  }
  save() {
  if (this.isEdit) {
    this.update();
  } else {
    this.create();
  }
}

update() {
  const formData = new FormData();

  formData.append('name', this.name);
  formData.append('description', this.description);
  formData.append('type', this.type);
  formData.append('fields', JSON.stringify(this.fields));

  formData.append('currency', this.currency);
  formData.append('conversionRate', String(this.conversionRate));
  formData.append('fee', String(this.fee));
  formData.append('feeType', this.feeType);
  formData.append('processingTime', String(this.processingTime));
  formData.append('processingUnit', this.processingUnit);
  formData.append('minWithdraw', String(this.minWithdraw));
  formData.append('maxWithdraw', String(this.maxWithdraw));

  if (this.file) {
    formData.append('image', this.file);
  }

  this.admin.updateWithdrawMethod(this.editId ?? '', formData)
    .subscribe(() => {
      this.resetForm();
      this.load();
      this.showForm = false;
    });
}
edit(m: any) {
  this.showForm = true;
  this.isEdit = true;
  this.editId = m.id;

  this.name = m.name;
  this.description = m.description;
  this.type = m.type;

  this.currency = m.currency;
  this.conversionRate = Number(m.conversion_rate);
  this.fee = Number(m.fee);
  this.feeType = m.fee_type;

  this.processingTime = m.processing_time;
  this.processingUnit = m.processing_unit;

  this.minWithdraw = Number(m.min_withdraw);
  this.maxWithdraw = Number(m.max_withdraw);

  this.fields = m.fields || [];

  this.preview = m.image_url;
}
  /* =========================
     🔹 LOAD
  ========================== */

  load() {
    this.admin.getWithdrawMethods().subscribe((res: any) => {
      this.methods = res;
    });
  }

  /* =========================
     🔹 FIELDS BUILDER
  ========================== */

  addField() {
    this.fields.push({ ...this.newField });

    this.newField = {
      name: '',
      label: '',
      type: 'text',
      required: false,
      options: []
    };
  }

  removeField(i: number) {
    this.fields.splice(i, 1);
  }

  addOption(input: HTMLInputElement) {
    if (!input.value) return;

    this.newField.options.push(input.value);
    input.value = '';
  }

  /* =========================
     🔹 CREATE METHOD
  ========================== */

create() {
  const formData = new FormData();

  // 🔹 BASICOS
  formData.append('name', this.name);
  formData.append('description', this.description);
  formData.append('type', this.type);
  formData.append('fields', JSON.stringify(this.fields));

  // 🔹 NUEVOS CAMPOS 🔥
  formData.append('currency', this.currency);
  formData.append('conversionRate', String(this.conversionRate));

  formData.append('fee', String(this.fee));
  formData.append('feeType', this.feeType);

  formData.append('processingTime', String(this.processingTime));
  formData.append('processingUnit', this.processingUnit);

  formData.append('minWithdraw', String(this.minWithdraw));
  formData.append('maxWithdraw', String(this.maxWithdraw));

  // 🔹 IMAGE
  if (this.file) {
    formData.append('image', this.file);
  }
if (this.minWithdraw > this.maxWithdraw) {
  alert('La retirada mínima no puede ser mayor que la máxima');
  return;
}
  this.admin.createWithdrawMethod(formData)
    .subscribe(() => {
      this.load();
      this.resetForm(); // 🔥 importante
      this.showForm = false;
    });
}

  resetForm() {
    this.name = '';
    this.description = '';
    this.image_url = '';
    this.currency = '';
    this.conversionRate = 0;
    this.fee = 0;
    this.feeType = 'percent';
    this.processingTime = 0;
    this.processingUnit = 'minutes';
    this.minWithdraw = 0;
    this.maxWithdraw = 0;
  }

  /* =========================
     🔹 ACTIVATE / DEACTIVATE
  ========================== */

  toggle(id: string) {
    this.admin.toggleWithdrawMethod(id).subscribe(() => {
      this.load();
      this.fields = [];
    });
  }
}