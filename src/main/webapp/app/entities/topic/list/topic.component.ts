import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ITopic } from '../topic.model';
import { TopicService } from '../service/topic.service';
import { TopicDeleteDialogComponent } from '../delete/topic-delete-dialog.component';

@Component({
  selector: 'jhi-topic',
  templateUrl: './topic.component.html',
})
export class TopicComponent implements OnInit {
  topics?: ITopic[];
  isLoading = false;

  constructor(protected topicService: TopicService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.topicService.query().subscribe({
      next: (res: HttpResponse<ITopic[]>) => {
        this.isLoading = false;
        this.topics = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: ITopic): number {
    return item.id!;
  }

  delete(topic: ITopic): void {
    const modalRef = this.modalService.open(TopicDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.topic = topic;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
