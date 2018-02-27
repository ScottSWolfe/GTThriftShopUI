import {Injectable} from '@angular/core';
import {Listing} from '../model/listing';
import {Observable} from 'rxjs/Observable';
import {HttpClient} from '@angular/common/http';
import {environment} from '../environments/environment';
import {ServerMessage} from '../model/server-message';

const COULD_NOT_CONNECT = 'Could not connect to server.';

@Injectable()
export class ListingService {

  constructor(private http: HttpClient) {}

  public getListings(): Observable<Listing[]> {
    return this.http.get<Listing[]>(environment.serverUrl + '/listings');
  }

  createListing(name: string, price: number, description: string, imageUrl: string,
                next?: (msg: ServerMessage) => void): void {
    this.http.post <ServerMessage>(environment.serverUrl + '/listings',
      {name: name, description: description, price: price, imageUrl: imageUrl})
      .subscribe(
        res => {
          next(res);
        }, err => {
          next(new ServerMessage(false, COULD_NOT_CONNECT));
        }
      );
  }
}
