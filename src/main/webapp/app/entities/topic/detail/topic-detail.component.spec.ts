import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { TopicDetailComponent } from './topic-detail.component';

describe('Topic Management Detail Component', () => {
  let comp: TopicDetailComponent;
  let fixture: ComponentFixture<TopicDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TopicDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ topic: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(TopicDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(TopicDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load topic on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.topic).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
