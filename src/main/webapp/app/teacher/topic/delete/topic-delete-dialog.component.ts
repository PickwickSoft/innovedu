import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ITopic } from '../topic.model';
import { TopicService } from '../service/topic.service';

@Component({
  templateUrl: './topic-delete-dialog.component.html',
})
export class TopicDeleteDialogComponent {
  topic?: ITopic;

  constructor(protected topicService: TopicService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.topicService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
