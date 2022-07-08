import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ContentService } from './content.service';
import { Content, IContent } from './content.model';
import { finalize, Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'jhi-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss'],
})
export class ContentComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    title: [null, [Validators.required, Validators.minLength(3)]],
    description: [null, [Validators.required, Validators.minLength(3)]],
  });

  constructor(protected contentService: ContentService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.contentService.query().subscribe((res: HttpResponse<IContent[]>) => {
      if (res.body && res.body.length > 0) {
        this.updateForm(res.body[0]);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const content = this.createFromForm();
    if (content.id !== undefined) {
      this.subscribeToSaveResponse(this.contentService.update(content));
    } else {
      this.subscribeToSaveResponse(this.contentService.create(content));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IContent>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    // Stay on page
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(content: IContent): void {
    this.editForm.patchValue({
      id: content.id,
      title: content.projectSectionTitle,
      description: content.projectSectionDescription,
    });
  }

  protected createFromForm(): IContent {
    return {
      ...new Content(),
      id: this.editForm.get(['id'])!.value,
      projectSectionTitle: this.editForm.get(['title'])!.value,
      projectSectionDescription: this.editForm.get(['description'])!.value,
    };
  }
}
