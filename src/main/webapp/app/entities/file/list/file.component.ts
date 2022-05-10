import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IFile } from '../file.model';
import { FileService } from '../service/file.service';
import { FileDeleteDialogComponent } from '../delete/file-delete-dialog.component';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-file',
  templateUrl: './file.component.html',
})
export class FileComponent implements OnInit {
  files?: IFile[];
  isLoading = false;

  constructor(protected fileService: FileService, protected dataUtils: DataUtils, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.fileService.query().subscribe({
      next: (res: HttpResponse<IFile[]>) => {
        this.isLoading = false;
        this.files = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IFile): number {
    return item.id!;
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    return this.dataUtils.openFile(base64String, contentType);
  }

  delete(file: IFile): void {
    const modalRef = this.modalService.open(FileDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.file = file;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
