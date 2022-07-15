import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { SafeUrl } from '@angular/platform-browser';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IProject } from '../project.model';
import { ProjectService } from '../service/project.service';
import { QRCodeElementType } from 'angularx-qrcode';

@Component({
  templateUrl: './project-qr-dialog.component.html',
  styleUrls: ['./project-qr-dialog.component.scss'],
})
export class ProjectQrDialogComponent {
  project?: IProject;
  public qrCodeDownloadLink: SafeUrl = '';
  elementType: QRCodeElementType = 'canvas' as QRCodeElementType;

  constructor(protected projectService: ProjectService, protected activeModal: NgbActiveModal, private location: Location) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  getURLForProject(project: IProject): string {
    return `${location.origin}/project/${project.id!}/view`;
  }

  onChangeURL(url: SafeUrl): void {
    this.qrCodeDownloadLink = url;
  }

  saveAsImage(parent: any): void {
    let parentElement = null;

    if (this.elementType === 'canvas') {
      // fetches base 64 data from canvas
      parentElement = parent.qrcElement.nativeElement.querySelector('canvas').toDataURL('image/png');
    } else if (this.elementType === 'img' || this.elementType === 'url') {
      // fetches base 64 data from image
      // parentElement contains the base64 encoded image src
      // you might use to store somewhere
      parentElement = parent.qrcElement.nativeElement.querySelector('img').src;
    } else {
      alert("Set elementType to 'canvas', 'img' or 'url'.");
    }

    if (parentElement) {
      // converts base 64 encoded image to blobData
      const blobData = this.convertBase64ToBlob(parentElement);
      // saves as image
      const blob = new Blob([blobData], { type: 'image/png' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      // name of the file
      link.download = 'Qrcode';
      link.click();
    }
  }

  private convertBase64ToBlob(Base64Image: string): Blob {
    // split into two parts
    const parts = Base64Image.split(';base64,');
    // hold the content type
    const imageType = parts[0].split(':')[1];
    // decode base64 string
    const decodedData = window.atob(parts[1]);
    // create unit8array of size same as row data length
    const uInt8Array = new Uint8Array(decodedData.length);
    // insert all character code into uint8array
    for (let i = 0; i < decodedData.length; ++i) {
      uInt8Array[i] = decodedData.charCodeAt(i);
    }
    // return blob image after conversion
    return new Blob([uInt8Array], { type: imageType });
  }
}
