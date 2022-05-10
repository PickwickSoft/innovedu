import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IFile } from '../file.model';
import { FileService } from '../service/file.service';

@Component({
  templateUrl: './file-delete-dialog.component.html',
})
export class FileDeleteDialogComponent {
  file?: IFile;

  constructor(protected fileService: FileService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.fileService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
