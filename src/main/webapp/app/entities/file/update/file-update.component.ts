import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IFile, File } from '../file.model';
import { FileService } from '../service/file.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IProject } from 'app/entities/project/project.model';
import { ProjectService } from 'app/entities/project/service/project.service';

@Component({
  selector: 'jhi-file-update',
  templateUrl: './file-update.component.html',
})
export class FileUpdateComponent implements OnInit {
  isSaving = false;

  projectsSharedCollection: IProject[] = [];

  projectControl = new FormControl();

  editForm = this.fb.group({
    id: [],
    data: [null, [Validators.required]],
    dataContentType: [],
    name: [null, [Validators.required, Validators.minLength(3)]],
    project: this.projectControl,
  });

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected fileService: FileService,
    protected projectService: ProjectService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ file }) => {
      this.updateForm(file);

      this.loadRelationshipsOptions();

      this.updateSelectedProject(file.project);
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('innoveduApp.error', { ...err, key: 'error.file.' + err.key })),
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const file = this.createFromForm();
    if (file.id !== undefined) {
      this.subscribeToSaveResponse(this.fileService.update(file));
    } else {
      this.subscribeToSaveResponse(this.fileService.create(file));
    }
  }

  trackProjectById(_index: number, item: IProject): string {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IFile>>): void {
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

  protected updateForm(file: IFile): void {
    this.editForm.patchValue({
      id: file.id,
      data: file.data,
      dataContentType: file.dataContentType,
      name: file.name,
      project: file.project,
    });

    this.projectsSharedCollection = this.projectService.addProjectToCollectionIfMissing(this.projectsSharedCollection, file.project);
  }

  protected loadRelationshipsOptions(): void {
    this.projectService
      .queryOfUser()
      .pipe(map((res: HttpResponse<IProject[]>) => res.body ?? []))
      .pipe(
        map((projects: IProject[]) => this.projectService.addProjectToCollectionIfMissing(projects, this.editForm.get('project')!.value))
      )
      .subscribe((projects: IProject[]) => (this.projectsSharedCollection = projects));
  }

  protected createFromForm(): IFile {
    return {
      ...new File(),
      id: this.editForm.get(['id'])!.value,
      dataContentType: this.editForm.get(['dataContentType'])!.value,
      data: this.editForm.get(['data'])!.value,
      name: this.editForm.get(['name'])!.value,
      project: this.projectsSharedCollection.find(project => project.id?.toString() === this.projectControl.value?.toString()),
    };
  }

  private updateSelectedProject(project: IProject): void {
    this.editForm.get('project')?.setValue(project.id);
  }
}
