import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class ServerProvider {
  data: any;
  host = 'http://localhost:8080/buses';

  constructor(private http: HttpClient){
    console.log('ServerProvider opened');
  }

  load(){
    if (this.data) {
      // already loaded data
      return Promise.resolve(this.data);
    }

    return new Promise(resolve => {
      this.http.get(this.host)
        .subscribe(data => {
          // in this promise is where we get all the data from the api
          // test server is being used in this instance
          this.data = data;
          resolve(this.data);
          console.log(this.data);
        });

    });
  }

}
