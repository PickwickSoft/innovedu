import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IProject } from '../project.model';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { FileService } from 'app/entities/file/service/file.service';
import { IFile } from '../../file/file.model';
import { DataUtils } from '../../../core/util/data-util.service';
import { mimeTypes } from 'mime-wrapper';

@Component({
  selector: 'jhi-project-detail',
  templateUrl: './project-detail.component.html',
})
export class ProjectDetailComponent implements OnInit {
  project: IProject | null = null;
  account: Account | null = null;
  files: IFile[] | null = null;

  constructor(
    protected activatedRoute: ActivatedRoute,
    private accountService: AccountService,
    protected fileService: FileService,
    protected dataUtils: DataUtils
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ project }) => {
      this.project = project;
    });
    this.accountService.identity().subscribe(account => (this.account = account));
    this.fileService.query({ projectId: this.project?.id }).subscribe(files => (this.files = files.body));
  }

  previousState(): void {
    window.history.back();
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
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
