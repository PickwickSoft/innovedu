import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { TopicService } from '../service/topic.service';
import { ITopic, Topic } from '../topic.model';

import { TopicUpdateComponent } from './topic-update.component';

describe('Topic Management Update Component', () => {
  let comp: TopicUpdateComponent;
  let fixture: ComponentFixture<TopicUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let topicService: TopicService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [TopicUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(TopicUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TopicUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    topicService = TestBed.inject(TopicService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const topic: ITopic = { id: 456 };

      activatedRoute.data = of({ topic });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(topic));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Topic>>();
      const topic = { id: 123 };
      jest.spyOn(topicService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ topic });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: topic }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(topicService.update).toHaveBeenCalledWith(topic);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Topic>>();
      const topic = new Topic();
      jest.spyOn(topicService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ topic });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: topic }));
      saveSubject.complete();

      // THEN
      expect(topicService.create).toHaveBeenCalledWith(topic);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Topic>>();
      const topic = { id: 123 };
      jest.spyOn(topicService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ topic });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(topicService.update).toHaveBeenCalledWith(topic);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
