import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IFile, File } from '../file.model';

import { FileService } from './file.service';

describe('File Service', () => {
  let service: FileService;
  let httpMock: HttpTestingController;
  let elemDefault: IFile;
  let expectedResult: IFile | IFile[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(FileService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      type: 'AAAAAAA',
      dataContentType: 'image/png',
      data: 'AAAAAAA',
      name: 'AAAAAAA',
      dimension: 0,
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

    it('should create a File', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new File()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a File', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          type: 'BBBBBB',
          data: 'BBBBBB',
          name: 'BBBBBB',
          dimension: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a File', () => {
      const patchObject = Object.assign(
        {
          data: 'BBBBBB',
          dimension: 1,
        },
        new File()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of File', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          type: 'BBBBBB',
          data: 'BBBBBB',
          name: 'BBBBBB',
          dimension: 1,
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

    it('should delete a File', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addFileToCollectionIfMissing', () => {
      it('should add a File to an empty array', () => {
        const file: IFile = { id: 123 };
        expectedResult = service.addFileToCollectionIfMissing([], file);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(file);
      });

      it('should not add a File to an array that contains it', () => {
        const file: IFile = { id: 123 };
        const fileCollection: IFile[] = [
          {
            ...file,
          },
          { id: 456 },
        ];
        expectedResult = service.addFileToCollectionIfMissing(fileCollection, file);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a File to an array that doesn't contain it", () => {
        const file: IFile = { id: 123 };
        const fileCollection: IFile[] = [{ id: 456 }];
        expectedResult = service.addFileToCollectionIfMissing(fileCollection, file);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(file);
      });

      it('should add only unique File to an array', () => {
        const fileArray: IFile[] = [{ id: 123 }, { id: 456 }, { id: 89460 }];
        const fileCollection: IFile[] = [{ id: 123 }];
        expectedResult = service.addFileToCollectionIfMissing(fileCollection, ...fileArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const file: IFile = { id: 123 };
        const file2: IFile = { id: 456 };
        expectedResult = service.addFileToCollectionIfMissing([], file, file2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(file);
        expect(expectedResult).toContain(file2);
      });

      it('should accept null and undefined values', () => {
        const file: IFile = { id: 123 };
        expectedResult = service.addFileToCollectionIfMissing([], null, file, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(file);
      });

      it('should return initial array if no File is added', () => {
        const fileCollection: IFile[] = [{ id: 123 }];
        expectedResult = service.addFileToCollectionIfMissing(fileCollection, undefined, null);
        expect(expectedResult).toEqual(fileCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
