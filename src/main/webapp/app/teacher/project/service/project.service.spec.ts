import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IProject, Project } from '../project.model';

import { ProjectService } from './project.service';

describe('Project Service', () => {
  let service: ProjectService;
  let httpMock: HttpTestingController;
  let elemDefault: IProject;
  let expectedResult: IProject | IProject[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ProjectService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      title: 'AAAAAAA',
      description: 'AAAAAAA',
      stars: 0,
      approved: false,
      date: currentDate,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          date: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Project', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          date: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          date: currentDate,
        },
        returnedFromService
      );

      service.create(new Project()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Project', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          title: 'BBBBBB',
          description: 'BBBBBB',
          stars: 1,
          approved: true,
          date: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          date: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Project', () => {
      const patchObject = Object.assign(
        {
          title: 'BBBBBB',
          date: currentDate.format(DATE_TIME_FORMAT),
        },
        new Project()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          date: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Project', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          title: 'BBBBBB',
          description: 'BBBBBB',
          stars: 1,
          approved: true,
          date: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          date: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Project', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addProjectToCollectionIfMissing', () => {
      it('should add a Project to an empty array', () => {
        const project: IProject = { id: 123 };
        expectedResult = service.addProjectToCollectionIfMissing([], project);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(project);
      });

      it('should not add a Project to an array that contains it', () => {
        const project: IProject = { id: 123 };
        const projectCollection: IProject[] = [
          {
            ...project,
          },
          { id: 456 },
        ];
        expectedResult = service.addProjectToCollectionIfMissing(projectCollection, project);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Project to an array that doesn't contain it", () => {
        const project: IProject = { id: 123 };
        const projectCollection: IProject[] = [{ id: 456 }];
        expectedResult = service.addProjectToCollectionIfMissing(projectCollection, project);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(project);
      });

      it('should add only unique Project to an array', () => {
        const projectArray: IProject[] = [{ id: 123 }, { id: 456 }, { id: 63189 }];
        const projectCollection: IProject[] = [{ id: 123 }];
        expectedResult = service.addProjectToCollectionIfMissing(projectCollection, ...projectArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const project: IProject = { id: 123 };
        const project2: IProject = { id: 456 };
        expectedResult = service.addProjectToCollectionIfMissing([], project, project2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(project);
        expect(expectedResult).toContain(project2);
      });

      it('should accept null and undefined values', () => {
        const project: IProject = { id: 123 };
        expectedResult = service.addProjectToCollectionIfMissing([], null, project, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(project);
      });

      it('should return initial array if no Project is added', () => {
        const projectCollection: IProject[] = [{ id: 123 }];
        expectedResult = service.addProjectToCollectionIfMissing(projectCollection, undefined, null);
        expect(expectedResult).toEqual(projectCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
