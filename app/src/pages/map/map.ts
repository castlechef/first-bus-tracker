import {Component, ElementRef, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, ModalController} from 'ionic-angular';
import {BusStopPage} from '../bus-stop/bus-stop';

/**
 * Generated class for the MapPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var google;

@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage {

  @ViewChild('map') mapElement: ElementRef;
  map: any;

  private colors = ['#bb72e0', '#90b2ed', '#049310', '#f9f06d', '#ffc36b', '#f7946a', '#ef60ff'];

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalctrl: ModalController) {
    this.busStopMarkers = new Map<number, google.maps.Marker>();
    this.busRouteLines = new Map<String, google.maps.Polyline>();
  }

  private busStopMarkers: Map<number, google.maps.Marker>;
  private busRouteLines: Map<String, google.maps.Polyline>;


  ionViewDidLoad() {
    this.loadMap()
      .then((latLng) => {
        if (latLng != null) this.addUserPositionMarker(latLng);
        this.addBusStops();
        this.addBusRoutes();
      });
  }

  private loadMap(): Promise<object> {
    let geo = navigator.geolocation;
    return new Promise<object>(resolve => {
      geo.getCurrentPosition((position) => {
        let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        this.createMap(latLng);
        resolve(latLng);
      }, () => {
        let latLng = new google.maps.LatLng(51.377981, -2.359026);
        this.createMap(latLng);
        console.log('Permission denied');
        resolve(null);
      });
    });
  }

  private createMap(latLng: Object) {
    const mapOptions = {
      center: latLng,
      zoom: 15,
      zoomControl: true,
      mapTypeControl: false,
      scaleControl: false,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: false,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      styles: [{
        featureType: 'transit.station.bus',
        elementType: 'all',
        stylers: [{
          visibility: 'off'
        }]
      }]
    };

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
  }

  private addUserPositionMarker(latLng) {
    let userPosition = new google.maps.Marker({
      map: this.map,
      position: latLng,
      title: 'Your Position',
    });

    navigator.geolocation.watchPosition((position) => {
      userPosition.setPosition(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
    });
  }

  /*
   {
      'busStopId': 1,
      'busStopName': "University of Bath",
      'location': {
        'latitude': 51,377954,
        'longitude': -2.357883
      }
      'routes':[
       {'name':"U1X", 'position': 1},
       {'name':"U1", 'position': 1}
      ]
    }
   */

  private addBusStops() {
    const busStops = [
      {
        'busStopID': 0,
        'busStopName': 'Arrivals Square (Stop C)',
        'location': {
          'latitude': 51.378845,
          'longitude': -2.324927
        },
        'routes': [
          {
            'name': 'U2',
            'position': 1
          }
        ]
      },
      {
        'busStopID': 1,
        'busStopName': 'The Avenue (Southbound)',
        'location': {
          'latitude': 51.3760679,
          'longitude': -2.3243903
        },
        'routes': [
          {
            'name': 'U1',
            'position': 2
          },
          {
            'name': 'U1X',
            'position': 2
          },
          {
            'name': 'U2',
            'position': 2
          }
        ]
      },
      {
        'busStopID': 2,
        'busStopName': 'Rainbow Wood Farm',
        'location': {
          'latitude': 51.3725468,
          'longitude': -2.3224108
        },
        'routes': [
          {
            'name': 'U2',
            'position': 3
          }
        ]
      },
      {
        'busStopID': 3,
        'busStopName': 'Brassknocker Hill',
        'location': {
          'latitude': 51.365948,
          'longitude': -2.3197219
        },
        'routes': [
          {
            'name': 'U2',
            'position': 4
          }
        ]
      },
      {
        'busStopID': 4,
        'busStopName': 'Flatwoods Road',
        'location': {
          'latitude': 51.3653829,
          'longitude': -2.3218583
        },
        'routes': [
          {
            'name': 'U2',
            'position': 5
          }
        ]
      },
      {'busStopID': 5,
        'busStopName': 'Ralph Allen School',
        'location': {
          'latitude': 51.3637848,
          'longitude': -2.3310113
        },
        'routes': [
          {
            'name': 'U2',
            'position': 6
          }
        ]
      },
      {
        'busStopID': 6,
        'busStopName': 'Shaft Road',
        'location': {
          'latitude': 51.3629001,
          'longitude': -2.3390767
        },
        'routes': [
          {
            'name': 'U2',
            'position': 7
          }
        ]
      },
      {
        'busStopID': 7,
        'busStopName': 'Tyning Road',
        'location': {
          'latitude': 51.362556,
          'longitude': -2.3423349
        },
        'routes': [
          {
            'name': 'U2',
            'position': 8
          }
        ]
      },
      {
        'busStopID': 8,
        'busStopName': 'Hadley Arms',
        'location': {
          'latitude': 51.3620745,
          'longitude': -2.3461718
        },
        'routes': [
          {
            'name': 'U2',
            'position': 9
          }
        ]
      },
      {
        'busStopID': 9,
        'busStopName': 'The Firs',
        'location': {
          'latitude': 51.3611789,
          'longitude': -2.348787
        },
        'routes': [
          {
            'name': 'U2',
            'position': 10
          }
        ]
      },
      {
        'busStopID': 10,
        'busStopName': 'Combe Road',
        'location': {
          'latitude': 51.3604349,
          'longitude': -2.3510937
        },
        'routes': [
          {
            'name': 'U2',
            'position': 11
          }
        ]
      },
      {
        'busStopID': 11,
        'busStopName': 'Mulberry Park',
        'location': {
          'latitude': 51.3600254,
          'longitude': -2.3529625
        },
        'routes': [
          {
            'name': 'U2',
            'position': 12
          }
        ]
      },
      {
        'busStopID': 12,
        'busStopName': 'Foxhill House',
        'location': {
          'latitude': 51.3591582,
          'longitude': -2.3573459
        },
        'routes': [
          {
            'name': 'U2',
            'position': 13
          }
        ]
      },
      {
        'busStopID': 13,
        'busStopName': 'Bradford Road Shops',
        'location': {
          'latitude': 51.3589099,
          'longitude': -2.3592979
        },
        'routes': [
          {
            'name': 'U2',
            'position': 14
          }
        ]
      },
      {
        'busStopID': 14,
        'busStopName': 'Entry Hill',
        'location': {
          'latitude': 51.358376,
          'longitude': -2.3629121
        },
        'routes': [
          {
            'name': 'U2',
            'position': 15
          }
        ]
      },
      {
        'busStopID': 15,
        'busStopName': 'Sainsbury\'s',
        'location': {
          'latitude': 51.356926,
          'longitude': -2.3716468
        },
        'routes': [
          {
            'name': 'U2',
            'position': 16
          }
        ]
      },
      {
        'busStopID': 16,
        'busStopName': 'Fosseway School',
        'location': {
          'latitude': 51.358173,
          'longitude': -2.3752047
        },
        'routes': [
          {
            'name': 'U2',
            'position': 17
          }
        ]
      },
      {
        'busStopID': 17,
        'busStopName': 'Red Lion',
        'location': {
          'latitude': 51.358837,
          'longitude': -2.3764881
        },
        'routes': [
          {
            'name': 'U2',
            'position': 18
          }
        ]
      },
      {
        'busStopID': 18,
        'busStopName': 'Noads Corner',
        'location': {
          'latitude': 51.360344,
          'longitude': -2.3798181
        },
        'routes': [
          {
            'name': 'U2',
            'position': 19
          }
        ]
      },
      {
        'busStopID': 19,
        'busStopName': 'Barrow Road',
        'location': {
          'latitude': 51.3615302,
          'longitude': -2.3830448
        },
        'routes': [
          {
            'name': 'U2',
            'position': 20
          }
        ]
      },
      {
        'busStopID': 20,
        'busStopName': 'Somerdale View',
        'location': {
          'latitude': 51.3621745,
          'longitude': -2.3851631
        },
        'routes': [
          {
            'name': 'U2',
            'position': 21
          }
        ]
      },
      {
        'busStopID': 21,
        'busStopName': 'Bath Community Academy',
        'location': {
          'latitude': 51.3644329,
          'longitude': -2.39199
        },
        'routes': [
          {
            'name': 'U2',
            'position': 22
          }
        ]
      },
      {
        'busStopID': 22,
        'busStopName': 'Padleigh Turn',
        'location': {
          'latitude': 51.3661729,
          'longitude': -2.3928671
        },
        'routes': [
          {
            'name': 'U2',
            'position': 23
          }
        ]
      },
      {
        'busStopID': 23,
        'busStopName': 'Southdown Road',
        'location': {
          'latitude': 51.3671529,
          'longitude': -2.3904759
        },
        'routes': [
          {
            'name': 'U2',
            'position': 24
          }
        ]
      },
      {
        'busStopID': 24,
        'busStopName': 'Sladebrook Court',
        'location': {
          'latitude': 51.3682598,
          'longitude': -2.3874892
        },
        'routes': [
          {
            'name': 'U2',
            'position': 25
          }
        ]
      },
      {
        'busStopID': 25,
        'busStopName': 'Trowbridge House',
        'location': {
          'latitude': 51.370792,
          'longitude': -2.3858812
        },
        'routes': [
          {
            'name': 'U2',
            'position': 26
          }
        ]
      },
      {
        'busStopID': 26,
        'busStopName': 'Happy Garden',
        'location': {
          'latitude': 51.3724062,
          'longitude': -2.3846602
        },
        'routes': [
          {
            'name': 'U2',
            'position': 27
          }
        ]
      },
      {
        'busStopID': 27,
        'busStopName': 'Ascension Church',
        'location': {
          'latitude': 51.3744351,
          'longitude': -2.3828658
        },
        'routes': [
          {
            'name': 'U2',
            'position': 28
          }
        ]
      },
      {
        'busStopID': 28,
        'busStopName': 'Bridge Road',
        'location': {
          'latitude': 51.3758088,
          'longitude': -2.3827203
        },
        'routes': [
          {
            'name': 'U2',
            'position': 29
          }
        ]
      },
      {
        'busStopID': 29,
        'busStopName': 'Mayfield Road',
        'location': {
          'latitude': 51.3759691,
          'longitude': -2.381471
        },
        'routes': [
          {
            'name': 'U2',
            'position': 30
          }
        ]
      },
      {
        'busStopID': 30,
        'busStopName': 'Moorland Road',
        'location': {
          'latitude': 51.3774219,
          'longitude': -2.3787238
        },
        'routes': [
          {
            'name': 'U2',
            'position': 31
          }
        ]
      },
      {
        'busStopID': 31,
        'busStopName': 'Arlington Road',
        'location': {
          'latitude': 51.3781929,
          'longitude': -2.3772372
        },
        'routes': [
          {
            'name': 'U2',
            'position': 32
          }
        ]
      },
      {
        'busStopID': 32,
        'busStopName': 'Brougham Hayes',
        'location': {
          'latitude': 51.3810272,
          'longitude': -2.3736249
        },
        'routes': [
          {
            'name': 'U1',
            'position': 17
          },
          {
            'name': 'U1X',
            'position': 18
          },
          {
            'name': 'U2',
            'position': 33
          }
        ]
      },
      {
        'busStopID': 33,
        'busStopName': 'Pines Way',
        'location': {
          'latitude': 51.3806422,
          'longitude': -2.3709923
        },
        'routes': [
          {
            'name': 'U1',
            'position': 18
          },
          {
            'name': 'U1X',
            'position': 19
          },
          {
            'name': 'U2',
            'position': 34
          }
        ]
      },
      {
        'busStopID': 34,
        'busStopName': 'Riverside Road',
        'location': {
          'latitude': 51.378719,
          'longitude': -2.3675711
        },
        'routes': [
          {
            'name': 'U1X',
            'position': 20
          },
          {
            'name': 'U2',
            'position': 35
          }
        ]
      },
      {
        'busStopID': 35,
        'busStopName': 'Oak Street (Eastbound)',
        'location': {
          'latitude': 51.3784901,
          'longitude': -2.3654998
        },
        'routes': [
          {
            'name': 'U1X',
            'position': 21
          },
          {
            'name': 'U2',
            'position': 36
          }
        ]
      },
      {
        'busStopID': 36,
        'busStopName': 'Rossiter Road',
        'location': {
          'latitude': 51.3770055,
          'longitude': -2.3578025
        },
        'routes': [
          {
            'name': 'U1X',
            'position': 22
          },
          {
            'name': 'U2',
            'position': 37
          }
        ]
      },
      {
        'busStopID': 37,
        'busStopName': 'Pulteney Court (Northbound)',
        'location': {
          'latitude': 51.3781389,
          'longitude': -2.3514739
        },
        'routes': [
          {
            'name': 'U1X',
            'position': 23
          },
          {
            'name': 'U2',
            'position': 38
          }
        ]
      },
      {
        'busStopID': 38,
        'busStopName': 'Pulteney Gardens (Northbound)',
        'location': {
          'latitude': 51.3799901,
          'longitude': -2.3513163
        },
        'routes': [
          {
            'name': 'U1X',
            'position': 24
          },
          {
            'name': 'U2',
            'position': 39
          }
        ]
      },
      {
        'busStopID': 39,
        'busStopName': 'St Mary\'s Church',
        'location': {
          'latitude': 51.3839299,
          'longitude': -2.3509153
        },
        'routes': [
          {
            'name': 'U1',
            'position': 24
          },
          {
            'name': 'U1X',
            'position': 25
          },
          {
            'name': 'U2',
            'position': 40
          }
        ]
      },
      {
        'busStopID': 40,
        'busStopName': 'Sydney Buildings',
        'location': {
          'latitude': 51.3826899,
          'longitude': -2.3481607
        },
        'routes': [
          {
            'name': 'U1',
            'position': 25
          },
          {
            'name': 'U1X',
            'position': 26
          },
          {
            'name': 'U2',
            'position': 41
          }
        ]
      },
      {
        'busStopID': 41,
        'busStopName': 'Cleveland Walk (Eastbound)',
        'location': {
          'latitude': 51.3809891,
          'longitude': -2.3455328
        },
        'routes': [
          {
            'name': 'U1',
            'position': 26
          },
          {
            'name': 'U1X',
            'position': 27
          },
          {
            'name': 'U2',
            'position': 42
          }
        ]
      },
      {
        'busStopID': 42,
        'busStopName': 'White Lodge (Eastbound)',
        'location': {
          'latitude': 51.379757,
          'longitude': -2.342693
        },
        'routes': [
          {
            'name': 'U1',
            'position': 27
          },
          {
            'name': 'U1X',
            'position': 28
          },
          {
            'name': 'U2',
            'position': 43
          }
        ]
      },
      {
        'busStopID': 43,
        'busStopName': 'Youth Hostel (Eastbound)',
        'location': {
          'latitude': 51.3785859,
          'longitude': -2.3399967
        },
        'routes': [
          {
            'name': 'U1',
            'position': 28
          },
          {
            'name': 'U1X',
            'position': 29
          },
          {
            'name': 'U2',
            'position': 44
          }
        ]
      },
      {
        'busStopID': 44,
        'busStopName': 'Smallcombe House (Eastbound)',
        'location': {
          'latitude': 51.3778652,
          'longitude': -2.3375639
        },
        'routes': [
          {
            'name': 'U1',
            'position': 29
          },
          {
            'name': 'U1X',
            'position': 30
          },
          {
            'name': 'U2',
            'position': 45
          }
        ]
      },
      {
        'busStopID': 45,
        'busStopName': 'Woodland Place (Eastbound)',
        'location': {
          'latitude': 51.3774341,
          'longitude': -2.333839
        },
        'routes': [
          {
            'name': 'U1',
            'position': 30
          },
          {
            'name': 'U1X',
            'position': 31
          },
          {
            'name': 'U2',
            'position': 46
          }
        ]
      },
      {
        'busStopID': 46,
        'busStopName': 'North Road (Eastbound)',
        'location': {
          'latitude': 51.3766062,
          'longitude': -2.3315202
        },
        'routes': [
          {
            'name': 'U1',
            'position': 31
          },
          {
            'name': 'U1X',
            'position': 32
          },
          {
            'name': 'U2',
            'position': 47
          }
        ]
      },
      {
        'busStopID': 47,
        'busStopName': 'Oakley',
        'location': {
          'latitude': 51.3742409,
          'longitude': -2.3281842
        },
        'routes': [
          {
            'name': 'U1',
            'position': 32
          },
          {
            'name': 'U1X',
            'position': 33
          },
          {
            'name': 'U2',
            'position': 48
          }
        ]
      },
      {
        'busStopID': 48,
        'busStopName': 'The Avenue (Northbound)',
        'location': {
          'latitude': 51.375916,
          'longitude': -2.3247048
        },
        'routes': [
          {
            'name': 'U1',
            'position': 33
          },
          {
            'name': 'U1X',
            'position': 34
          },
          {
            'name': 'U2',
            'position': 49
          }
        ]
      },
      {
        'busStopID': 49,
        'busStopName': 'Arrivals Square (Stop A)',
        'location': {
          'latitude': 51.379070,
          'longitude': -2.325222
        },
        'routes': [
          {
            'name': 'U1',
            'position': 1
          },
          {
            'name': 'U1X',
            'position': 1
          }
        ]
      },
      {
        'busStopID': 50,
        'busStopName': 'Oakley',
        'location': {
          'latitude': 51.3744091,
          'longitude': -2.329062
        },
        'routes': [
          {
            'name': 'U1',
            'position': 3
          },
          {
            'name': 'U1X',
            'position': 3
          }
        ]
      },
      {
        'busStopID': 51,
        'busStopName': 'North Road (Westbound)',
        'location': {
          'latitude': 51.3768272,
          'longitude': -2.3321251
        },
        'routes': [
          {
            'name': 'U1',
            'position': 4
          },
          {
            'name': 'U1X',
            'position': 4
          }
        ]
      },
      {
        'busStopID': 52,
        'busStopName': 'Woodland Place (Westbound)',
        'location': {
          'latitude': 51.3775061,
          'longitude': -2.3344579
        },
        'routes': [
          {
            'name': 'U1',
            'position': 5
          },
          {
            'name': 'U1X',
            'position': 5
          }
        ]
      },
      {
        'busStopID': 53,
        'busStopName': 'Smallcombe House (Westbound)',
        'location': {
          'latitude': 51.3777919,
          'longitude': -2.3379649
        },
        'routes': [
          {
            'name': 'U1',
            'position': 6
          },
          {
            'name': 'U1X',
            'position': 6
          }
        ]
      },
      {
        'busStopID': 54,
        'busStopName': 'Youth Hostel (Westbound)',
        'location': {
          'latitude': 51.3786659,
          'longitude': -2.3403997
        },
        'routes': [
          {
            'name': 'U1',
            'position': 7
          },
          {
            'name': 'U1X',
            'position': 7
          }
        ]
      },
      {
        'busStopID': 55,
        'busStopName': 'White Lodge (Westbound)',
        'location': {
          'latitude': 51.3799131,
          'longitude': -2.3437002
        },
        'routes': [
          {
            'name': 'U1',
            'position': 8
          },
          {
            'name': 'U1X',
            'position': 8
          }
        ]
      },
      {
        'busStopID': 56,
        'busStopName': 'Cleveland Walk (Westbound)',
        'location': {
          'latitude': 51.3809171,
          'longitude': -2.3456468
        },
        'routes': [
          {
            'name': 'U1',
            'position': 9
          },
          {
            'name': 'U1X',
            'position': 9
          }
        ]
      },
      {
        'busStopID': 57,
        'busStopName': 'Raby Gardens',
        'location': {
          'latitude': 51.3832779,
          'longitude': -2.3502488
        },
        'routes': [
          {
            'name': 'U1',
            'position': 10
          },
          {
            'name': 'U1X',
            'position': 10
          }
        ]
      },
      {
        'busStopID': 58,
        'busStopName': 'Pulteney Gardens (Southbound)',
        'location': {
          'latitude': 51.3795619,
          'longitude': -2.3510829
        },
        'routes': [
          {
            'name': 'U1X',
            'position': 11
          }
        ]
      },
      {
        'busStopID': 59,
        'busStopName': 'Pulteney Court (Southbound)',
        'location': {
          'latitude': 51.3783988,
          'longitude': -2.3511017
        },
        'routes': [
          {
            'name': 'U1X',
            'position': 12
          }
        ]
      },
      {
        'busStopID': 60,
        'busStopName': 'Lyncombe Hill',
        'location': {
          'latitude': 51.376576,
          'longitude': -2.3568564
        },
        'routes': [
          {
            'name': 'U1X',
            'position': 13
          }
        ]
      },
      {
        'busStopID': 61,
        'busStopName': 'Oak Street (Westbound)',
        'location': {
          'latitude': 51.3784101,
          'longitude': -2.3657721
        },
        'routes': [
          {
            'name': 'U1',
            'position': 13
          },
          {
            'name': 'U1X',
            'position': 14
          }
        ]
      },
      {
        'busStopID': 62,
        'busStopName': 'Cheltenham Street',
        'location': {
          'latitude': 51.3783842,
          'longitude': -2.3685877
        },
        'routes': [
          {
            'name': 'U1',
            'position': 14
          },
          {
            'name': 'U1X',
            'position': 15
          }
        ]
      },
      {
        'busStopID': 63,
        'busStopName': 'Hayesfield School',
        'location': {
          'latitude': 51.377144,
          'longitude': -2.3709923
        },
        'routes': [
          {
            'name': 'U1',
            'position': 15
          },
          {
            'name': 'U1X',
            'position': 16
          }
        ]
      },
      {
        'busStopID': 64,
        'busStopName': 'Junction Road',
        'location': {
          'latitude': 51.3776212,
          'longitude': -2.3738978
        },
        'routes': [
          {
            'name': 'U1',
            'position': 16
          },
          {
            'name': 'U1X',
            'position': 17
          }
        ]
      },
      {
        'busStopID': 65,
        'busStopName': 'North Parade',
        'location': {
          'latitude': 51.3807489,
          'longitude': -2.356322
        },
        'routes': [
          {
            'name': 'U1',
            'position': 11
          }
        ]
      },
      {
        'busStopID': 66,
        'busStopName': 'Dorchester Street (Westbound)',
        'location': {
          'latitude': 51.377869,
          'longitude': -2.3576939
        },
        'routes': [
          {
            'name': 'U1',
            'position': 12
          }
        ]
      },
      {
        'busStopID': 67,
        'busStopName': 'Green Park',
        'location': {
          'latitude': 51.3805472,
          'longitude': -2.3662783
        },
        'routes': [
          {
            'name': 'U1',
            'position': 19
          }
        ]
      },
      {
        'busStopID': 68,
        'busStopName': 'Corn Street',
        'location': {
          'latitude': 51.3792108,
          'longitude': -2.3624307
        },
        'routes': [
          {
            'name': 'U1',
            'position': 20
          }
        ]
      },
      {
        'busStopID': 69,
        'busStopName': 'Dorchester Street (Eastbound)',
        'location': {
          'latitude': 51.3780439,
          'longitude': -2.359031
        },
        'routes': [
          {
            'name': 'U1',
            'position': 21
          }
        ]
      },
      {
        'busStopID': 70,
        'busStopName': 'Guildhall',
        'location': {
          'latitude': 51.3816805,
          'longitude': -2.3586655
        },
        'routes': [
          {
            'name': 'U1',
            'position': 22
          }
        ]
      },
      {
        'busStopID': 71,
        'busStopName': 'The Pavilion',
        'location': {
          'latitude': 51.3809008,
          'longitude': -2.3540957
        },
        'routes': [
          {
            'name': 'U1',
            'position': 23
          }
        ]
      }
    ];

    for (let i = 0; i < busStops.length; i++) {
      let stopMarker = new google.maps.Marker({
        map: this.map,
        position: new google.maps.LatLng(busStops[i].location.latitude, busStops[i].location.longitude),
        title: busStops[i].busStopName
      });

      this.busStopMarkers.set(busStops[i].busStopID, stopMarker);
      google.maps.event.addListener(stopMarker, 'click', () => this.openBusStopPage(busStops[i].busStopID, busStops[i].busStopName));
    }
  }

  private openBusStopPage(busStopID, busStopName) {
    let tryModal = this.modalctrl.create(BusStopPage, {stopID: busStopID, stopName: busStopName});
    tryModal.present();

    /*this.navCtrl.push(BusStopPage, {
      stopID: busStopID,
      stopName: busStopName
    });*/
  }

  private addBusRoutes() {
    const exampleBusRouteCoordinates = [
     /* {
        'routeName': 'U1X',
        'positions': [
          {latitude: 51.378739, longitude: -2.325066},
          {latitude: 51.377843, longitude: -2.325291}
        ]
      },
      {
        'routeName': 'U1',
        'positions': [
          {latitude: 51.378739, longitude: -2.325066}, //lat lng
          {latitude: 51.377843, longitude: -2.325291}
        ]
      }*/

        {
          "routeName": "Section 1",
          "positions": [
            {"latitude": 51.379117, "longitude": -2.325228},
            {"latitude": 51.379043, "longitude": -2.325035},
            {"latitude": 51.378772, "longitude": -2.325094},
            {"latitude": 51.378454, "longitude": -2.325164},
            {"latitude": 51.378062, "longitude": -2.325255},
            {"latitude": 51.377841, "longitude": -2.325304},
            {"latitude": 51.377697, "longitude": -2.325395},
            {"latitude": 51.377537, "longitude": -2.325545},
            {"latitude": 51.377473, "longitude": -2.325615},
            {"latitude": 51.377349, "longitude": -2.325706},
            {"latitude": 51.377208, "longitude": -2.325674},
            {"latitude": 51.377091, "longitude": -2.325599},
            {"latitude": 51.377004, "longitude": -2.325497},
            {"latitude": 51.376937, "longitude": -2.325363},
            {"latitude": 51.376820, "longitude": -2.325105},
            {"latitude": 51.376753, "longitude": -2.324890},
            {"latitude": 51.376659, "longitude": -2.324681},
            {"latitude": 51.376539, "longitude": -2.324499},
            {"latitude": 51.376391, "longitude": -2.324408},
            {"latitude": 51.376291, "longitude": -2.324402},
            {"latitude": 51.376174, "longitude": -2.324424},
            {"latitude": 51.376043, "longitude": -2.324520},
            {"latitude": 51.375836, "longitude": -2.324671},
            {"latitude": 51.375407, "longitude": -2.325019},
            {"latitude": 51.374865, "longitude": -2.325518},
            {"latitude": 51.374325, "longitude": -2.326006},
            {"latitude": 51.374034, "longitude": -2.326210},
            {"latitude": 51.373713, "longitude": -2.326500}
          ]
        },
        {
          "routeName": "Section 2",
          "positions": [
            {"latitude": 51.373706, "longitude": -2.326505},
            {"latitude": 51.374516, "longitude": -2.329241},
            {"latitude": 51.374553, "longitude": -2.329375},
            {"latitude": 51.375414, "longitude": -2.330341},
            {"latitude": 51.375809, "longitude": -2.330781},
            {"latitude": 51.376154, "longitude": -2.331151},
            {"latitude": 51.376408, "longitude": -2.331371},
            {"latitude": 51.376576, "longitude": -2.331521},
            {"latitude": 51.376756, "longitude": -2.331859},
            {"latitude": 51.376897, "longitude": -2.332143},
            {"latitude": 51.377041, "longitude": -2.332653},
            {"latitude": 51.377225, "longitude": -2.333211},
            {"latitude": 51.377520, "longitude": -2.334219},
            {"latitude": 51.377600, "longitude": -2.334788},
            {"latitude": 51.377661, "longitude": -2.335496},
            {"latitude": 51.377721, "longitude": -2.336665},
            {"latitude": 51.377808, "longitude": -2.337728},
            {"latitude": 51.377888, "longitude": -2.338436},
            {"latitude": 51.377928, "longitude": -2.338661},
            {"latitude": 51.377969, "longitude": -2.338897},
            {"latitude": 51.378092, "longitude": -2.339208},
            {"latitude": 51.378290, "longitude": -2.339616},
            {"latitude": 51.378558, "longitude": -2.340024},
            {"latitude": 51.378886, "longitude": -2.340678},
            {"latitude": 51.379281, "longitude": -2.341413},
            {"latitude": 51.379412, "longitude": -2.341611},
            {"latitude": 51.379499, "longitude": -2.341794},
            {"latitude": 51.379529, "longitude": -2.341955},
            {"latitude": 51.379670, "longitude": -2.342432},
            {"latitude": 51.379807, "longitude": -2.343044},
            {"latitude": 51.379964, "longitude": -2.343671},
            {"latitude": 51.380152, "longitude": -2.344186},
            {"latitude": 51.380466, "longitude": -2.344927},
            {"latitude": 51.380694, "longitude": -2.345356},
            {"latitude": 51.381056, "longitude": -2.345721},
            {"latitude": 51.381504, "longitude": -2.346150},
            {"latitude": 51.381889, "longitude": -2.346606},
            {"latitude": 51.382197, "longitude": -2.347062},
            {"latitude": 51.382351, "longitude": -2.347351},
            {"latitude": 51.382489, "longitude": -2.347727},
            {"latitude": 51.382633, "longitude": -2.348199},
            {"latitude": 51.382730, "longitude": -2.348537},
            {"latitude": 51.382753, "longitude": -2.348687},
            {"latitude": 51.382770, "longitude": -2.348848},
            {"latitude": 51.382787, "longitude": -2.349089},
            {"latitude": 51.382827, "longitude": -2.349266},
            {"latitude": 51.382900, "longitude": -2.349497},
            {"latitude": 51.382971, "longitude": -2.349642},
            {"latitude": 51.383135, "longitude": -2.349905},
            {"latitude": 51.383366, "longitude": -2.350227},
            {"latitude": 51.383573, "longitude": -2.350543},
            {"latitude": 51.383764, "longitude": -2.350838},
            {"latitude": 51.383908, "longitude": -2.351085},
            {"latitude": 51.384069, "longitude": -2.351401}
          ]
        },
        {
          "routeName":"Section 3",
          "positions": [
            {"latitude": 51.384062, "longitude": -2.351423},
            {"latitude": 51.383721, "longitude": -2.351401},
            {"latitude": 51.383152, "longitude": -2.351391},
            {"latitude": 51.382171, "longitude": -2.351348},
            {"latitude": 51.381414, "longitude": -2.351316},
            {"latitude": 51.380918, "longitude": -2.351283}
          ]
        },
        {
          "routeName": "Section 4",
          "positions": [
            {"latitude": 51.380918, "longitude": -2.351283},
            {"latitude": 51.380902, "longitude": -2.352265},
            {"latitude": 51.380868, "longitude": -2.353488},
            {"latitude": 51.380845, "longitude": -2.355022},
            {"latitude": 51.380811, "longitude": -2.356653},
            {"latitude": 51.380821, "longitude": -2.357195}
          ]
        },
        {
          "routeName": "Section 5",
          "positions": [
            {"latitude": 51.380821, "longitude": -2.357195},
            {"latitude": 51.380510, "longitude": -2.357157},
            {"latitude": 51.379967, "longitude": -2.357115},
            {"latitude": 51.379291, "longitude": -2.357082},
            {"latitude": 51.378618, "longitude": -2.357056},
            {"latitude": 51.377938, "longitude": -2.357013},
            {"latitude": 51.377912, "longitude": -2.357453},
            {"latitude": 51.377982, "longitude": -2.358595},
            {"latitude": 51.378025, "longitude": -2.359421},
            {"latitude": 51.378056, "longitude": -2.359759}]
        },
        {
          "routeName": "Section 6",
          "positions": [
            {"latitude": 51.378056, "longitude": -2.359759},
            {"latitude": 51.377865, "longitude": -2.360006},
            {"latitude": 51.377811, "longitude": -2.360237},
            {"latitude": 51.377804, "longitude": -2.360333},
            {"latitude": 51.377768, "longitude": -2.360381},
            {"latitude": 51.377727, "longitude": -2.360403},
            {"latitude": 51.377530, "longitude": -2.360473},
            {"latitude": 51.377466, "longitude": -2.360483},
            {"latitude": 51.377419, "longitude": -2.360440},
            {"latitude": 51.377403, "longitude": -2.360398},
            {"latitude": 51.377379, "longitude": -2.360344},
            {"latitude": 51.377356, "longitude": -2.360274},
            {"latitude": 51.377329, "longitude": -2.359995},
            {"latitude": 51.377302, "longitude": -2.359834},
            {"latitude": 51.377275, "longitude": -2.359743},
            {"latitude": 51.377225, "longitude": -2.359673},
            {"latitude": 51.377175, "longitude": -2.359636},
            {"latitude": 51.377125, "longitude": -2.359636},
            {"latitude": 51.377011, "longitude": -2.359904},
            {"latitude": 51.377018, "longitude": -2.360049},
            {"latitude": 51.377018, "longitude": -2.359813},
            {"latitude": 51.377078, "longitude": -2.359673},
            {"latitude": 51.377041, "longitude": -2.359732},
            {"latitude": 51.377162, "longitude": -2.361320},
            {"latitude": 51.377192, "longitude": -2.361411},
            {"latitude": 51.377232, "longitude": -2.361449},
            {"latitude": 51.377289, "longitude": -2.361481},
            {"latitude": 51.377339, "longitude": -2.361470},
            {"latitude": 51.377413, "longitude": -2.361508},
            {"latitude": 51.377470, "longitude": -2.361556},
            {"latitude": 51.377513, "longitude": -2.361621},
            {"latitude": 51.377142, "longitude": -2.361192},
            {"latitude": 51.377111, "longitude": -2.360950},
            {"latitude": 51.377068, "longitude": -2.360424},
            {"latitude": 51.377567, "longitude": -2.361760}
          ]
        },
        {
          "routeName": "Section 7",
          "positions": [
            {"latitude": 51.377567, "longitude": -2.361760},
            {"latitude": 51.377661, "longitude": -2.362109},
            {"latitude": 51.377975, "longitude": -2.363369},
            {"latitude": 51.378293, "longitude": -2.364646},
            {"latitude": 51.378451, "longitude": -2.365478},
            {"latitude": 51.378538, "longitude": -2.366180},
            {"latitude": 51.378581, "longitude": -2.366540},
            {"latitude": 51.378605, "longitude": -2.367007},
            {"latitude": 51.378652, "longitude": -2.367484},
            {"latitude": 51.378702, "longitude": -2.367768},
            {"latitude": 51.378772, "longitude": -2.368037},
            {"latitude": 51.378903, "longitude": -2.368455}
          ]
        },
        {
          "routeName": "Section 8",
          "positions": [
            {"latitude": 51.378903, "longitude": -2.368455},
            {"latitude": 51.378739, "longitude": -2.368600},
            {"latitude": 51.378575, "longitude": -2.368653},
            {"latitude": 51.378390, "longitude": -2.368664},
            {"latitude": 51.378163, "longitude": -2.368675},
            {"latitude": 51.378046, "longitude": -2.368729},
            {"latitude": 51.377935, "longitude": -2.368782},
            {"latitude": 51.377784, "longitude": -2.368948},
            {"latitude": 51.377540, "longitude": -2.369308},
            {"latitude": 51.377366, "longitude": -2.369571},
            {"latitude": 51.377289, "longitude": -2.369699},
            {"latitude": 51.377235, "longitude": -2.369812},
            {"latitude": 51.377208, "longitude": -2.369978},
            {"latitude": 51.377192, "longitude": -2.370247},
            {"latitude": 51.377192, "longitude": -2.370933},
            {"latitude": 51.377185, "longitude": -2.371218},
            {"latitude": 51.377162, "longitude": -2.371438},
            {"latitude": 51.377121, "longitude": -2.371733},
            {"latitude": 51.377085, "longitude": -2.371899},
            {"latitude": 51.377075, "longitude": -2.372017},
            {"latitude": 51.377078, "longitude": -2.372167},
            {"latitude": 51.377101, "longitude": -2.372296},
            {"latitude": 51.377142, "longitude": -2.372409},
            {"latitude": 51.377202, "longitude": -2.372521},
            {"latitude": 51.377329, "longitude": -2.372671},
            {"latitude": 51.377493, "longitude": -2.372838},
            {"latitude": 51.377584, "longitude": -2.373015},
            {"latitude": 51.377600, "longitude": -2.373208},
            {"latitude": 51.377594, "longitude": -2.373379},
            {"latitude": 51.377570, "longitude": -2.373519},
            {"latitude": 51.377617, "longitude": -2.373712},
            {"latitude": 51.377751, "longitude": -2.374157},
            {"latitude": 51.377858, "longitude": -2.374549},
            {"latitude": 51.378009, "longitude": -2.375064},
            {"latitude": 51.378139, "longitude": -2.375557},
            {"latitude": 51.378180, "longitude": -2.375718},
            {"latitude": 51.378196, "longitude": -2.375879},
            {"latitude": 51.378206, "longitude": -2.376035},
            {"latitude": 51.378233, "longitude": -2.376185},
            {"latitude": 51.378263, "longitude": -2.376298},
            {"latitude": 51.378323, "longitude": -2.376426},
            {"latitude": 51.378397, "longitude": -2.376534}
          ]
        },
        {
          "routeName":"Section J",
          "positions": [
            {"latitude": 51.378397, "longitude": -2.376534},
            {"latitude": 51.378501, "longitude": -2.376603},
            {"latitude": 51.378642, "longitude": -2.376630},
            {"latitude": 51.378735, "longitude": -2.376587},
            {"latitude": 51.378853, "longitude": -2.376566},
            {"latitude": 51.378956, "longitude": -2.376523},
            {"latitude": 51.379013, "longitude": -2.376448},
            {"latitude": 51.379074, "longitude": -2.376357},
            {"latitude": 51.379137, "longitude": -2.376233},
            {"latitude": 51.379214, "longitude": -2.376105},
            {"latitude": 51.379291, "longitude": -2.375981},
            {"latitude": 51.379971, "longitude": -2.375359},
            {"latitude": 51.380982, "longitude": -2.374409},
            {"latitude": 51.381166, "longitude": -2.374211},
            {"latitude": 51.381116, "longitude": -2.374034},
            {"latitude": 51.380982, "longitude": -2.373707},
            {"latitude": 51.380912, "longitude": -2.373524},
            {"latitude": 51.380882, "longitude": -2.373444},
            {"latitude": 51.380872, "longitude": -2.373331},
            {"latitude": 51.380865, "longitude": -2.373213},
            {"latitude": 51.380885, "longitude": -2.373111},
            {"latitude": 51.380908, "longitude": -2.373031},
            {"latitude": 51.380952, "longitude": -2.372966},
            {"latitude": 51.381072, "longitude": -2.372859},
            {"latitude": 51.381119, "longitude": -2.372779},
            {"latitude": 51.381143, "longitude": -2.372698},
            {"latitude": 51.381169, "longitude": -2.372602},
            {"latitude": 51.381176, "longitude": -2.372516},
            {"latitude": 51.381166, "longitude": -2.372403},
            {"latitude": 51.381133, "longitude": -2.372296},
            {"latitude": 51.381092, "longitude": -2.372194},
            {"latitude": 51.380965, "longitude": -2.371883},
            {"latitude": 51.380761, "longitude": -2.371384},
            {"latitude": 51.380550, "longitude": -2.370858}
          ]
        },
        {
          "routeName": "Section K",
          "positions": [
            {"latitude": 51.380550, "longitude": -2.370858},
            {"latitude": 51.380497, "longitude": -2.370713},
            {"latitude": 51.380440, "longitude": -2.370526},
            {"latitude": 51.380396, "longitude": -2.370424},
            {"latitude": 51.380379, "longitude": -2.370322},
            {"latitude": 51.380366, "longitude": -2.370220},
            {"latitude": 51.380369, "longitude": -2.370139},
            {"latitude": 51.380396, "longitude": -2.369995},
            {"latitude": 51.380420, "longitude": -2.369887},
            {"latitude": 51.380453, "longitude": -2.369694},
            {"latitude": 51.380493, "longitude": -2.369463},
            {"latitude": 51.380563, "longitude": -2.369093},
            {"latitude": 51.380630, "longitude": -2.368820},
            {"latitude": 51.380851, "longitude": -2.368267},
            {"latitude": 51.381116, "longitude": -2.367672},
            {"latitude": 51.381210, "longitude": -2.367430},
            {"latitude": 51.381250, "longitude": -2.367302},
            {"latitude": 51.381260, "longitude": -2.367232},
            {"latitude": 51.381260, "longitude": -2.367151},
            {"latitude": 51.381253, "longitude": -2.367087},
            {"latitude": 51.381246, "longitude": -2.367001},
            {"latitude": 51.381240, "longitude": -2.366937},
            {"latitude": 51.381226, "longitude": -2.366846},
            {"latitude": 51.381213, "longitude": -2.366749},
            {"latitude": 51.381156, "longitude": -2.366465},
            {"latitude": 51.381106, "longitude": -2.366239},
            {"latitude": 51.380808, "longitude": -2.366320},
            {"latitude": 51.380644, "longitude": -2.366352},
            {"latitude": 51.380430, "longitude": -2.366368},
            {"latitude": 51.380306, "longitude": -2.366347},
            {"latitude": 51.380162, "longitude": -2.366309},
            {"latitude": 51.380055, "longitude": -2.366234},
            {"latitude": 51.379911, "longitude": -2.366121},
            {"latitude": 51.379753, "longitude": -2.365918},
            {"latitude": 51.379609, "longitude": -2.365655},
            {"latitude": 51.379512, "longitude": -2.365456},
            {"latitude": 51.379418, "longitude": -2.365204},
            {"latitude": 51.379241, "longitude": -2.364775},
            {"latitude": 51.379187, "longitude": -2.364351},
            {"latitude": 51.379207, "longitude": -2.363884},
            {"latitude": 51.379211, "longitude": -2.363412},
            {"latitude": 51.379167, "longitude": -2.362726},
            {"latitude": 51.379151, "longitude": -2.362382},
            {"latitude": 51.379050, "longitude": -2.361905},
            {"latitude": 51.378953, "longitude": -2.361411},
            {"latitude": 51.378899, "longitude": -2.361170},
            {"latitude": 51.378873, "longitude": -2.360891},
            {"latitude": 51.378846, "longitude": -2.360618},
            {"latitude": 51.378826, "longitude": -2.360473},
            {"latitude": 51.378802, "longitude": -2.360365},
            {"latitude": 51.378772, "longitude": -2.360296},
            {"latitude": 51.378742, "longitude": -2.360237},
            {"latitude": 51.378652, "longitude": -2.360113},
            {"latitude": 51.378555, "longitude": -2.359979},
            {"latitude": 51.378461, "longitude": -2.359872},
            {"latitude": 51.378347, "longitude": -2.359781},
            {"latitude": 51.378210, "longitude": -2.359732},
            {"latitude": 51.378056, "longitude": -2.359759}
          ]
        },
        {
          "routeName": "Section L",
          "positions": [
            {"latitude": 51.380550, "longitude": -2.370858},
            {"latitude": 51.380473, "longitude": -2.370746},
            {"latitude": 51.380399, "longitude": -2.370590},
            {"latitude": 51.380336, "longitude": -2.370515},
            {"latitude": 51.380292, "longitude": -2.370461},
            {"latitude": 51.380242, "longitude": -2.370472},
            {"latitude": 51.380168, "longitude": -2.370493},
            {"latitude": 51.380081, "longitude": -2.370585},
            {"latitude": 51.380024, "longitude": -2.370670},
            {"latitude": 51.379967, "longitude": -2.370724},
            {"latitude": 51.379914, "longitude": -2.370762},
            {"latitude": 51.379847, "longitude": -2.370772},
            {"latitude": 51.379777, "longitude": -2.370762},
            {"latitude": 51.379710, "longitude": -2.370708},
            {"latitude": 51.379663, "longitude": -2.370649},
            {"latitude": 51.379515, "longitude": -2.370236},
            {"latitude": 51.379341, "longitude": -2.369726},
            {"latitude": 51.379120, "longitude": -2.369066},
            {"latitude": 51.378903, "longitude": -2.368455}
          ]
        },
        {
          "routeName": "Section M",
          "positions": [
            {"latitude": 51.380821, "longitude": -2.357195},
            {"latitude": 51.381461, "longitude": -2.357533}
          ]
        },
        {
          "routeName": "Section N",
          "positions": [
            {"latitude": 51.381461, "longitude": -2.357533},
            {"latitude": 51.381498, "longitude": -2.357624},
            {"latitude": 51.381518, "longitude": -2.357715},
            {"latitude": 51.381521, "longitude": -2.357785},
            {"latitude": 51.381521, "longitude": -2.357855},
            {"latitude": 51.381521, "longitude": -2.357925},
            {"latitude": 51.381518, "longitude": -2.357984},
            {"latitude": 51.381514, "longitude": -2.358064},
            {"latitude": 51.381534, "longitude": -2.358134},
            {"latitude": 51.381595, "longitude": -2.358198},
            {"latitude": 51.381648, "longitude": -2.358268},
            {"latitude": 51.381695, "longitude": -2.358370},
            {"latitude": 51.381735, "longitude": -2.358568},
            {"latitude": 51.381745, "longitude": -2.358745},
            {"latitude": 51.381786, "longitude": -2.358896},
            {"latitude": 51.381832, "longitude": -2.359008},
            {"latitude": 51.381943, "longitude": -2.359046},
            {"latitude": 51.382268, "longitude": -2.359121},
            {"latitude": 51.382485, "longitude": -2.359148},
            {"latitude": 51.382619, "longitude": -2.359148},
            {"latitude": 51.382700, "longitude": -2.359083},
            {"latitude": 51.382753, "longitude": -2.358965},
            {"latitude": 51.382790, "longitude": -2.358815},
            {"latitude": 51.382823, "longitude": -2.358681},
            {"latitude": 51.382860, "longitude": -2.358536}
          ]
        },
        {
          "routeName": "Section O",
          "positions": [
            {"latitude": 51.382860, "longitude":-2.358536},
            {"latitude": 51.382857, "longitude":-2.358461},
            {"latitude": 51.382854, "longitude":-2.358381},
            {"latitude": 51.382847, "longitude":-2.358311},
            {"latitude": 51.382837, "longitude":-2.358252},
            {"latitude": 51.382797, "longitude":-2.358182},
            {"latitude": 51.382743, "longitude":-2.358112},
            {"latitude": 51.382479, "longitude":-2.357769},
            {"latitude": 51.382227, "longitude":-2.357431},
            {"latitude": 51.382137, "longitude":-2.357345},
            {"latitude": 51.382040, "longitude":-2.357351},
            {"latitude": 51.381960, "longitude":-2.357426},
            {"latitude": 51.381916, "longitude":-2.357522},
            {"latitude": 51.381832, "longitude":-2.357630},
            {"latitude": 51.381709, "longitude":-2.357640},
            {"latitude": 51.381571, "longitude":-2.357581},
            {"latitude": 51.381461, "longitude":-2.357533}
          ]
        },
        {
          "routeName": "Section P",
          "positions": [
            {"latitude": 51.382860, "longitude": -2.358536},
            {"latitude": 51.383078, "longitude": -2.357790},
            {"latitude": 51.383322, "longitude": -2.357147},
            {"latitude": 51.383373, "longitude": -2.357013},
            {"latitude": 51.383439, "longitude": -2.356857},
            {"latitude": 51.383543, "longitude": -2.356664},
            {"latitude": 51.383620, "longitude": -2.356508},
            {"latitude": 51.383711, "longitude": -2.356380},
            {"latitude": 51.383727, "longitude": -2.356246},
            {"latitude": 51.383771, "longitude": -2.356085},
            {"latitude": 51.383888, "longitude": -2.355757},
            {"latitude": 51.384045, "longitude": -2.355253},
            {"latitude": 51.384363, "longitude": -2.354438},
            {"latitude": 51.384712, "longitude": -2.353558},
            {"latitude": 51.385010, "longitude": -2.352780},
            {"latitude": 51.385231, "longitude": -2.352228},
            {"latitude": 51.385361, "longitude": -2.351997},
            {"latitude": 51.385519, "longitude": -2.351809},
            {"latitude": 51.385468, "longitude": -2.351707},
            {"latitude": 51.385358, "longitude": -2.351578},
            {"latitude": 51.385060, "longitude": -2.351482},
            {"latitude": 51.384732, "longitude": -2.351471},
            {"latitude": 51.384474, "longitude": -2.351439},
            {"latitude": 51.384072, "longitude": -2.351428}
          ]
        },
        {
          "routeName": "Section Q",
          "positions": [
            {"latitude": 51.3736778, "longitude": -2.3265013},
            {"latitude": 51.3730013, "longitude": -2.3241953},
            {"latitude": 51.372526, "longitude": -2.3225998},
            {"latitude": 51.3721453, "longitude": -2.3212911},
            {"latitude": 51.3719329, "longitude": -2.3206153},
            {"latitude": 51.371667, "longitude": -2.3198131},
            {"latitude": 51.371415, "longitude": -2.319161},
            {"latitude": 51.371198, "longitude": -2.318748},
            {"latitude": 51.371005, "longitude": -2.3184689},
            {"latitude": 51.3708161, "longitude": -2.3182651},
            {"latitude": 51.3706887, "longitude": -2.3181444},
            {"latitude": 51.3705227, "longitude": -2.318019},
            {"latitude": 51.3703081, "longitude": -2.3179168},
            {"latitude": 51.3700017, "longitude": -2.3178258},
            {"latitude": 51.3696854, "longitude": -2.3177369},
            {"latitude": 51.3693473, "longitude": -2.3176537},
            {"latitude": 51.368962, "longitude": -2.3176356},
            {"latitude": 51.3686807, "longitude": -2.317649},
            {"latitude": 51.368395, "longitude": -2.3176805},
            {"latitude": 51.3681957, "longitude": -2.317775},
            {"latitude": 51.367936, "longitude": -2.3179167},
            {"latitude": 51.3677293, "longitude": -2.3180625},
            {"latitude": 51.3674994, "longitude": -2.3182235},
            {"latitude": 51.3672155, "longitude": -2.3184515},
            {"latitude": 51.366852, "longitude": -2.3187438},
            {"latitude": 51.36654, "longitude": -2.3190215},
            {"latitude": 51.3663876, "longitude": -2.319142},
            {"latitude": 51.3662864, "longitude": -2.3193327},
            {"latitude": 51.3660812, "longitude": -2.3196604},
            {"latitude": 51.3659079, "longitude": -2.3199905},
            {"latitude": 51.3657234, "longitude": -2.3204001},
            {"latitude": 51.3656085, "longitude": -2.3207921},
            {"latitude": 51.365477, "longitude": -2.321527},
            {"latitude": 51.36533, "longitude": -2.322273},
            {"latitude": 51.365159, "longitude": -2.323107},
            {"latitude": 51.3650256, "longitude": -2.3237247},
            {"latitude": 51.3647611, "longitude": -2.3250356},
            {"latitude": 51.3645122, "longitude": -2.326256},
            {"latitude": 51.3643261, "longitude": -2.327304},
            {"latitude": 51.3641629, "longitude": -2.3283583},
            {"latitude": 51.3639878, "longitude": -2.3296276},
            {"latitude": 51.36386, "longitude": -2.330609},
            {"latitude": 51.363732, "longitude": -2.331655},
            {"latitude": 51.3636072, "longitude": -2.3327424},
            {"latitude": 51.3635169, "longitude": -2.3335917},
            {"latitude": 51.363436, "longitude": -2.3344407},
            {"latitude": 51.363362, "longitude": -2.33515},
            {"latitude": 51.3632962, "longitude": -2.3358557},
            {"latitude": 51.3632047, "longitude": -2.3367338},
            {"latitude": 51.3631116, "longitude": -2.3376847},
            {"latitude": 51.3630011, "longitude": -2.3387575},
            {"latitude": 51.3628887, "longitude": -2.3398103},
            {"latitude": 51.3627938, "longitude": -2.340722},
            {"latitude": 51.362687, "longitude": -2.341606},
            {"latitude": 51.362584, "longitude": -2.342373},
            {"latitude": 51.362533, "longitude": -2.343344},
            {"latitude": 51.3625244, "longitude": -2.3441383},
            {"latitude": 51.3625237, "longitude": -2.3447037},
            {"latitude": 51.3625, "longitude": -2.344986},
            {"latitude": 51.362463, "longitude": -2.345152},
            {"latitude": 51.3622678, "longitude": -2.3457472},
            {"latitude": 51.36184, "longitude": -2.347003},
            {"latitude": 51.360678, "longitude": -2.350457},
            {"latitude": 51.3602574, "longitude": -2.3518739},
            {"latitude": 51.3600322, "longitude": -2.353228},
            {"latitude": 51.3599858, "longitude": -2.3535521},
            {"latitude": 51.3599289, "longitude": -2.3536626},
            {"latitude": 51.3599346, "longitude": -2.3538302},
            {"latitude": 51.3598745, "longitude": -2.3541107},
            {"latitude": 51.3595789, "longitude": -2.3555872},
            {"latitude": 51.3592771, "longitude": -2.35696},
            {"latitude": 51.3591253, "longitude": -2.357966},
            {"latitude": 51.3589985, "longitude": -2.358973},
            {"latitude": 51.3588125, "longitude": -2.3603374},
            {"latitude": 51.358534, "longitude": -2.362179},
            {"latitude": 51.358172, "longitude": -2.364099},
            {"latitude": 51.3579629, "longitude": -2.365066},
            {"latitude": 51.3577184, "longitude": -2.3660127},
            {"latitude": 51.3573974, "longitude": -2.3669596},
            {"latitude": 51.357003, "longitude": -2.367945},
            {"latitude": 51.3569102, "longitude": -2.3680592},
            {"latitude": 51.3569365, "longitude": -2.3683018},
            {"latitude": 51.356753, "longitude": -2.3686536},
            {"latitude": 51.3565746, "longitude": -2.3691942},
            {"latitude": 51.3565186, "longitude": -2.3694867},
            {"latitude": 51.3565152, "longitude": -2.3698293},
            {"latitude": 51.3565245, "longitude": -2.3700804},
            {"latitude": 51.356588, "longitude": -2.370426},
            {"latitude": 51.3567072, "longitude": -2.3707821},
            {"latitude": 51.3569457, "longitude": -2.3714711},
            {"latitude": 51.3571095, "longitude": -2.3719701},
            {"latitude": 51.3571792, "longitude": -2.3722546},
            {"latitude": 51.3572077, "longitude": -2.3724394},
            {"latitude": 51.3571467, "longitude": -2.372493},
            {"latitude": 51.3571304, "longitude": -2.3726014},
            {"latitude": 51.3571618, "longitude": -2.3727037},
            {"latitude": 51.3572255, "longitude": -2.372726},
            {"latitude": 51.3572779, "longitude": -2.3726954},
            {"latitude": 51.357398, "longitude": -2.373025},
            {"latitude": 51.3575283, "longitude": -2.3733726},
            {"latitude": 51.3578835, "longitude": -2.3742966},
            {"latitude": 51.3582907, "longitude": -2.3753806},
            {"latitude": 51.3584814, "longitude": -2.3756793},
            {"latitude": 51.3584536, "longitude": -2.3757587},
            {"latitude": 51.3584653, "longitude": -2.3758395},
            {"latitude": 51.3585026, "longitude": -2.3759034},
            {"latitude": 51.3585552, "longitude": -2.3759192},
            {"latitude": 51.3586014, "longitude": -2.3758835},
            {"latitude": 51.3586643, "longitude": -2.3760205},
            {"latitude": 51.3588952, "longitude": -2.3765053},
            {"latitude": 51.359156, "longitude": -2.3770729},
            {"latitude": 51.359525, "longitude": -2.3778873},
            {"latitude": 51.3600316, "longitude": -2.378981},
            {"latitude": 51.3604605, "longitude": -2.3799667},
            {"latitude": 51.3610064, "longitude": -2.3812343},
            {"latitude": 51.3612568, "longitude": -2.3819213},
            {"latitude": 51.3616935, "longitude": -2.383446},
            {"latitude": 51.3618674, "longitude": -2.384005},
            {"latitude": 51.3618906, "longitude": -2.3841944},
            {"latitude": 51.3618956, "longitude": -2.3843092},
            {"latitude": 51.3618825, "longitude": -2.3843917},
            {"latitude": 51.3618454, "longitude": -2.3844199},
            {"latitude": 51.3618171, "longitude": -2.384485},
            {"latitude": 51.3618119, "longitude": -2.3845751},
            {"latitude": 51.3618341, "longitude": -2.3846585},
            {"latitude": 51.3618733, "longitude": -2.3846958},
            {"latitude": 51.3619319, "longitude": -2.384709},
            {"latitude": 51.3620793, "longitude": -2.3848579},
            {"latitude": 51.3622196, "longitude": -2.3850957},
            {"latitude": 51.3625386, "longitude": -2.3859827},
            {"latitude": 51.362829, "longitude": -2.3868041},
            {"latitude": 51.3630723, "longitude": -2.387351},
            {"latitude": 51.3632878, "longitude": -2.3876647},
            {"latitude": 51.3635625, "longitude": -2.388034},
            {"latitude": 51.3637891, "longitude": -2.3883734},
            {"latitude": 51.3639541, "longitude": -2.3887415},
            {"latitude": 51.364064, "longitude": -2.3891498},
            {"latitude": 51.3641098, "longitude": -2.3895704},
            {"latitude": 51.3641468, "longitude": -2.3901115},
            {"latitude": 51.364195, "longitude": -2.390739},
            {"latitude": 51.364302, "longitude": -2.391307},
            {"latitude": 51.3644513, "longitude": -2.3918937},
            {"latitude": 51.364642, "longitude": -2.3922985},
            {"latitude": 51.3651401, "longitude": -2.3931904},
            {"latitude": 51.36565, "longitude": -2.394095},
            {"latitude": 51.3658212, "longitude": -2.3937236},
            {"latitude": 51.36605, "longitude": -2.39304},
            {"latitude": 51.3663413, "longitude": -2.392226},
            {"latitude": 51.3666593, "longitude": -2.3913633},
            {"latitude": 51.3668424, "longitude": -2.3909502},
            {"latitude": 51.3671474, "longitude": -2.3903555},
            {"latitude": 51.3672494, "longitude": -2.39006},
            {"latitude": 51.3673063, "longitude": -2.3897942},
            {"latitude": 51.3673463, "longitude": -2.3892853},
            {"latitude": 51.3673682, "longitude": -2.3888803},
            {"latitude": 51.3673977, "longitude": -2.3886493},
            {"latitude": 51.3674586, "longitude": -2.3884402},
            {"latitude": 51.3675587, "longitude": -2.3882845},
            {"latitude": 51.367686, "longitude": -2.3881258},
            {"latitude": 51.3677952, "longitude": -2.3879802},
            {"latitude": 51.3679139, "longitude": -2.3877588},
            {"latitude": 51.3679946, "longitude": -2.3874232},
            {"latitude": 51.3680853, "longitude": -2.3874556},
            {"latitude": 51.3682306, "longitude": -2.3874047},
            {"latitude": 51.3686965, "longitude": -2.3871396},
            {"latitude": 51.369088, "longitude": -2.386903},
            {"latitude": 51.3697348, "longitude": -2.3865197},
            {"latitude": 51.3705165, "longitude": -2.3860425},
            {"latitude": 51.3709275, "longitude": -2.3857324},
            {"latitude": 51.371643, "longitude": -2.3851641},
            {"latitude": 51.3723227, "longitude": -2.3846382},
            {"latitude": 51.3727597, "longitude": -2.3842581},
            {"latitude": 51.3730419, "longitude": -2.3838807},
            {"latitude": 51.3733173, "longitude": -2.3835066},
            {"latitude": 51.3735936, "longitude": -2.3831639},
            {"latitude": 51.3738737, "longitude": -2.3829605},
            {"latitude": 51.3740957, "longitude": -2.3828326},
            {"latitude": 51.3746062, "longitude": -2.3828006},
            {"latitude": 51.375233, "longitude": -2.382789},
            {"latitude": 51.375574, "longitude": -2.382778},
            {"latitude": 51.3756782, "longitude": -2.3827455},
            {"latitude": 51.3759097, "longitude": -2.3825416},
            {"latitude": 51.3762185, "longitude": -2.3822668},
            {"latitude": 51.376033, "longitude": -2.3817886},
            {"latitude": 51.3757923, "longitude": -2.3811272},
            {"latitude": 51.3755836, "longitude": -2.3805325},
            {"latitude": 51.377219, "longitude": -2.378873},
            {"latitude": 51.377289, "longitude": -2.378798},
            {"latitude": 51.3778299, "longitude": -2.378138},
            {"latitude": 51.3778763, "longitude": -2.3780667},
            {"latitude": 51.3778975, "longitude": -2.3779903},
            {"latitude": 51.3779025, "longitude": -2.3778906},
            {"latitude": 51.3778975, "longitude": -2.3777717},
            {"latitude": 51.3778853, "longitude": -2.37766},
            {"latitude": 51.377882, "longitude": -2.377558},
            {"latitude": 51.3778913, "longitude": -2.3774757},
            {"latitude": 51.3779439, "longitude": -2.3773742},
            {"latitude": 51.3780848, "longitude": -2.3772348},
            {"latitude": 51.3782796, "longitude": -2.3770363},
            {"latitude": 51.378354, "longitude": -2.3769567},
            {"latitude": 51.3783753, "longitude": -2.3768157},
            {"latitude": 51.3783881, "longitude": -2.3766853},
            {"latitude": 51.378387, "longitude": -2.3765809}
          ]
        }
    ];


    for (let i = 0; i < exampleBusRouteCoordinates.length; i++) {
      let busRoutePath = exampleBusRouteCoordinates[i].positions;
      const googleMapStyle = busRoutePath.map(({latitude, longitude}) => {
        return {lat: latitude, lng: longitude}
      });

      let busRoute = new google.maps.Polyline({
        path: googleMapStyle,
        geodesic: true,
        strokeColor: this.colors[i % 7],
        strokeOpacity: 0.8,
        strokeWeight: 3
      });

      this.busRouteLines.set(exampleBusRouteCoordinates[i].routeName, busRoute);

      busRoute.setMap(this.map);
    }
  }
}
