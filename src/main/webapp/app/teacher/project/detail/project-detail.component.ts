import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { mimeTypes } from 'mime-wrapper';

import { IProject } from '../project.model';
import { DataUtils } from '../../../core/util/data-util.service';
import { IFile } from '../../../entities/file/file.model';
import { FileService } from '../../../entities/file/service/file.service';

@Component({
  selector: 'jhi-project-detail',
  templateUrl: './project-detail.component.html',
})
export class ProjectDetailComponent implements OnInit {
  project: IProject | null = null;
  files: IFile[] | null = null;

  constructor(protected activatedRoute: ActivatedRoute, protected dataUtils: DataUtils, protected fileService: FileService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ project }) => {
      this.project = project;
    });
    this.fileService.query({ projectId: this.project?.id }).subscribe(files => (this.files = files.body));
  }

  previousState(): void {
    window.history.back();
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    return this.dataUtils.openFile(base64String, contentType);
  }

  getExtension(type: string | null | undefined): string {
    if (type == null) {
      return '';
    }
    return mimeTypes.getExtension(type);
  }
}
