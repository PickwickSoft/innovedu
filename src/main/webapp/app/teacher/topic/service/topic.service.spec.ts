import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ITopic, Topic } from '../topic.model';

import { TopicService } from './topic.service';

describe('Topic Service', () => {
  let service: TopicService;
  let httpMock: HttpTestingController;
  let elemDefault: ITopic;
  let expectedResult: ITopic | ITopic[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(TopicService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      title: 'AAAAAAA',
      description: 'AAAAAAA',
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign({}, elemDefault);

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Topic', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Topic()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Topic', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          title: 'BBBBBB',
          description: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Topic', () => {
      const patchObject = Object.assign({}, new Topic());

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Topic', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          title: 'BBBBBB',
          description: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Topic', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addTopicToCollectionIfMissing', () => {
      it('should add a Topic to an empty array', () => {
        const topic: ITopic = { id: 123 };
        expectedResult = service.addTopicToCollectionIfMissing([], topic);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(topic);
      });

      it('should not add a Topic to an array that contains it', () => {
        const topic: ITopic = { id: 123 };
        const topicCollection: ITopic[] = [
          {
            ...topic,
          },
          { id: 456 },
        ];
        expectedResult = service.addTopicToCollectionIfMissing(topicCollection, topic);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Topic to an array that doesn't contain it", () => {
        const topic: ITopic = { id: 123 };
        const topicCollection: ITopic[] = [{ id: 456 }];
        expectedResult = service.addTopicToCollectionIfMissing(topicCollection, topic);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(topic);
      });

      it('should add only unique Topic to an array', () => {
        const topicArray: ITopic[] = [{ id: 123 }, { id: 456 }, { id: 96916 }];
        const topicCollection: ITopic[] = [{ id: 123 }];
        expectedResult = service.addTopicToCollectionIfMissing(topicCollection, ...topicArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const topic: ITopic = { id: 123 };
        const topic2: ITopic = { id: 456 };
        expectedResult = service.addTopicToCollectionIfMissing([], topic, topic2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(topic);
        expect(expectedResult).toContain(topic2);
      });

      it('should accept null and undefined values', () => {
        const topic: ITopic = { id: 123 };
        expectedResult = service.addTopicToCollectionIfMissing([], null, topic, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(topic);
      });

      it('should return initial array if no Topic is added', () => {
        const topicCollection: ITopic[] = [{ id: 123 }];
        expectedResult = service.addTopicToCollectionIfMissing(topicCollection, undefined, null);
        expect(expectedResult).toEqual(topicCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
