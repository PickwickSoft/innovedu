import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IFile } from '../file.model';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-file-detail',
  templateUrl: './file-detail.component.html',
})
export class FileDetailComponent implements OnInit {
  file: IFile | null = null;

  constructor(protected dataUtils: DataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ file }) => {
      this.file = file;
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  previousState(): void {
    window.history.back();
  }
}
