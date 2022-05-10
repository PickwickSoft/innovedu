import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { FileService } from '../service/file.service';

import { FileComponent } from './file.component';

describe('File Management Component', () => {
  let comp: FileComponent;
  let fixture: ComponentFixture<FileComponent>;
  let service: FileService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [FileComponent],
    })
      .overrideTemplate(FileComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(FileComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(FileService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.files?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
