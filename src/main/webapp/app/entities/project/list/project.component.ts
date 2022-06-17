import { Component, OnInit, TemplateRef } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IProject } from '../project.model';

import { ASC, DESC, ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { ProjectService } from '../service/project.service';
import { ProjectDeleteDialogComponent } from '../delete/project-delete-dialog.component';
import { ParseLinks } from 'app/core/util/parse-links.service';
import { debounceTime, Subject } from 'rxjs';
import { Account } from '../../../core/auth/account.model';
import { AccountService } from '../../../core/auth/account.service';

@Component({
  selector: 'jhi-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project-list.scss'],
})
export class ProjectComponent implements OnInit {
  projects: IProject[];
  userProjects: IProject[];
  initialSize: number;
  isLoading = false;
  itemsPerPage: number;
  links: { [key: string]: number };
  page: number;
  predicate: string;
  ascending: boolean;
  value: any;
  debounceSearch: Subject<any> = new Subject<any>();
  account: Account | null = null;
  publicView: TemplateRef<any> | null = null;

  constructor(
    protected projectService: ProjectService,
    protected modalService: NgbModal,
    protected parseLinks: ParseLinks,
    private accountService: AccountService
  ) {
    this.projects = [];
    this.userProjects = [];
    this.initialSize = -1;
    this.itemsPerPage = ITEMS_PER_PAGE;
    this.page = 0;
    this.links = {
      last: 0,
    };
    this.predicate = 'id';
    this.ascending = true;
    this.value = '';
  }

  loadAll(): void {
    this.isLoading = true;

    this.projectService
      .query({
        page: this.page,
        size: this.itemsPerPage,
        sort: this.sort(),
        search: this.value,
      })
      .subscribe({
        next: (res: HttpResponse<IProject[]>) => {
          this.isLoading = false;
          this.paginateProjects(res.body, res.headers);
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }

  loadAllOfUser(): void {
    this.isLoading = true;

    this.projectService
      .queryOfUser({
        size: this.itemsPerPage,
        sort: this.sort(),
        search: this.value,
      })
      .subscribe({
        next: (res: HttpResponse<IProject[]>) => {
          this.isLoading = false;
          this.userProjects = res.body != null ? res.body : [];
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }

  reset(): void {
    this.page = 0;
    this.projects = [];
    this.userProjects = [];
    this.loadAll();
    this.loadAllOfUser();
  }

  loadPage(page: number): void {
    this.page = page;
    this.loadAll();
  }

  ngOnInit(): void {
    this.debounceSearch.pipe(debounceTime(500)).subscribe(() => {
      this.reset();
    });
    this.loadAll();
    this.loadAllOfUser();
    this.accountService.identity().subscribe(account => (this.account = account));
  }

  trackId(_index: number, item: IProject): string {
    return item.id!;
  }

  delete(project: IProject): void {
    const modalRef = this.modalService.open(ProjectDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.project = project;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.reset();
      }
    });
  }

  protected sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? ASC : DESC)];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  protected paginateProjects(data: IProject[] | null, headers: HttpHeaders): void {
    const linkHeader = headers.get('link');
    if (linkHeader) {
      this.links = this.parseLinks.parse(linkHeader);
    } else {
      this.links = {
        last: 0,
      };
    }
    if (data) {
      for (const d of data) {
        this.projects.push(d);
      }
    }
    if (this.initialSize === -1) {
      this.initialSize = this.projects.length;
    }
  }
}
