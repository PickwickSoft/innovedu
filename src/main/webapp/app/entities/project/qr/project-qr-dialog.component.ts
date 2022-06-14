import { Component } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IProject } from '../project.model';
import { ProjectService } from '../service/project.service';

@Component({
  templateUrl: './project-qr-dialog.component.html',
})
export class ProjectQrDialogComponent {
  project?: IProject;
  public qrCodeDownloadLink: SafeUrl = '';

  constructor(protected projectService: ProjectService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  getURLForProject(project: IProject): string {
    // TODO: Generate QR URL with the application's DNS / Baseurl
    const id = project.id!;
    return `/project/${id}/view`;
  }

  onChangeURL(url: SafeUrl): void {
    this.qrCodeDownloadLink = url;
  }
}
