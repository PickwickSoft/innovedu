import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { IProject, Project } from '../project.model';
import { ProjectService } from '../service/project.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { ITopic } from 'app/teacher/topic/topic.model';
import { TopicService } from 'app/teacher/topic/service/topic.service';

@Component({
  selector: 'jhi-project-update',
  templateUrl: './project-update.component.html',
})
export class ProjectUpdateComponent implements OnInit {
  isSaving = false;

  usersSharedCollection: IUser[] = [];
  topicsSharedCollection: ITopic[] = [];

  topicControl = new FormControl();

  editForm = this.fb.group({
    id: [],
    title: [null, [Validators.required, Validators.minLength(3)]],
    description: [null, [Validators.required, Validators.minLength(3)]],
    topic: this.topicControl,
  });

  constructor(
    protected projectService: ProjectService,
    protected userService: UserService,
    protected topicService: TopicService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ project }) => {
      if (project.id === undefined) {
        const today = dayjs().startOf('day');
        project.date = today;
      }

      this.updateForm(project);

      this.loadRelationshipsOptions();

      this.updateSelectedTopic(project);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const project = this.createFromForm();
    if (project.id !== undefined) {
      this.subscribeToSaveResponse(this.projectService.update(project));
    } else {
      this.subscribeToSaveResponse(this.projectService.create(project));
    }
  }

  trackUserById(_index: number, item: IUser): string {
    return item.id!;
  }

  trackTopicById(_index: number, item: ITopic): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProject>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(project: IProject): void {
    this.editForm.patchValue({
      id: project.id,
      title: project.title,
      description: project.description,
      topic: project.topic,
    });

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(this.usersSharedCollection, project.user);
    this.topicsSharedCollection = this.topicService.addTopicToCollectionIfMissing(this.topicsSharedCollection, project.topic);
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing(users, this.editForm.get('user')!.value)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));

    this.topicService
      .query()
      .pipe(map((res: HttpResponse<ITopic[]>) => res.body ?? []))
      .pipe(map((topics: ITopic[]) => this.topicService.addTopicToCollectionIfMissing(topics, this.editForm.get('topic')!.value)))
      .subscribe((topics: ITopic[]) => (this.topicsSharedCollection = topics));
  }

  protected createFromForm(): IProject {
    return {
      ...new Project(),
      id: this.editForm.get(['id'])!.value,
      title: this.editForm.get(['title'])!.value,
      description: this.editForm.get(['description'])!.value,
      topic: this.topicsSharedCollection.find(topic => topic.id?.toString() === this.topicControl.value?.toString()),
    };
  }

  private updateSelectedTopic(project: IProject): void {
    this.editForm.get('topic')?.setValue(project.topic?.id);
  }
}
