import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ITopic } from '../topic.model';

@Component({
  selector: 'jhi-topic-detail',
  templateUrl: './topic-detail.component.html',
})
export class TopicDetailComponent implements OnInit {
  topic: ITopic | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ topic }) => {
      this.topic = topic;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
