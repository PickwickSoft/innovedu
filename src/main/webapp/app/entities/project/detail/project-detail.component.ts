import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IProject } from '../project.model';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';

@Component({
  selector: 'jhi-project-detail',
  templateUrl: './project-detail.component.html',
})
export class ProjectDetailComponent implements OnInit {
  project: IProject | null = null;
  account: Account | null = null;

  constructor(protected activatedRoute: ActivatedRoute, private accountService: AccountService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ project }) => {
      this.project = project;
    });
    this.accountService.identity().subscribe(account => (this.account = account));
  }

  previousState(): void {
    window.history.back();
  }
}
