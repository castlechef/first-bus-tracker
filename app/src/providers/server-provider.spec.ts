import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ServerProvider } from './server-provider';

describe('ServerProvider', () => {
  let injector: TestBed;
  let service: ServerProvider;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ServerProvider]
    });
    injector = getTestBed();
    service = injector.get(ServerProvider);
    httpMock = injector.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('#getAllBuses', () => {
    it('Should return all data for each bus running', () => {
      const dummyData: any = [
        {
          'busId': 1,
          'location': {
            'latitude': 53.003444,
            'longitude': -2.273507
          },
          'routeName': 'U2'
        },
        {
          'busId': 2,
          'location': {
            'latitude': 53.9643824,
            'longitude': -2.295362
          },
          'routeName': 'U2'
        },
        {
          'busId': 3,
          'location': {
            'latitude': 53.837285,
            'longitude': -2.276247
          },
          'routeName': 'U1X'
        }
      ];

      service.getLocations().subscribe(data => {
        expect(data.length).toBe(3);
        expect(data).toEqual(dummyData);
      });
      const req = httpMock.expectOne('http://localhost:8080/buses');
      expect(req.request.method).toBe('GET');
      req.flush(dummyData);
    });
  });

  // This is just updating the location of the bus
  describe('#getBuseOneLocation', () => {
    it('It should return the location of the bus', () => {
      const dummyData: any = [
        {
          'location': {
            'latitude': 53.003444,
            'longitude': -2.273507
          },
        },
      ];

      service.getLocations().subscribe(data => {
        expect(data.length).toBe(1);
        expect(data).toEqual(dummyData);
      });
      const req = httpMock.expectOne('http://localhost:8080/buses/1/location');
      expect(req.request.method).toBe('GET');
      req.flush(dummyData);
    });
  });

  // This is just the inital request
  describe('#getBuseOneData', () => {
    it("It should return all of bus one's data", () => {
      const dummyData: any = [
        {
          'busId': 1,
          'location': {
            'latitude': 53.003444,
            'longitude': -2.273507
          },
          'routeName': 'U2',
          'expectedArrival': 0,
          'capacity': 'full',
        },
      ];

      service.getLocations().subscribe(data => {
        expect(data.length).toBe(1);
        expect(data).toEqual(dummyData);
      });
      const req = httpMock.expectOne('http://localhost:8080/buses/1');
      expect(req.request.method).toBe('GET');
      req.flush(dummyData);
    });
  });
});
