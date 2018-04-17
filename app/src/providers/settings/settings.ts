import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';


/*
  Generated class for the SettingsProvider provider.
*/
@Injectable()
export class SettingsProvider {

  // list of bus stop names
  private favouriteStops: string[];

  constructor(private storage: Storage) {
    this.favouriteStops = [];
    this.storage
      .get('favourites')
      .then(favs => {
        console.log('favs', favs);
        if (favs === null) {
          this.resetFavourites();
        } else {
          this.favouriteStops = favs;
        }
      });
  }

  private async resetFavourites(): Promise<void> {
    try {
      this.storage.set('favourites', []);
    } catch (e) {
      console.log('Error getting favourites :(', e.message);
    }
  }

  private hasStop(stopName: string): boolean {
    return this.favouriteStops.indexOf(stopName) !== -1;
  }

  public async addFavouriteStop(stopName: string): Promise<boolean> {
    if (this.hasStop(stopName)) {
      return false;
    } else {
      this.favouriteStops.push(stopName);
      this.favouriteStops.sort();
      await this.updateStoredFavourites();
      return true;
    }
  }

  public async removeFavouriteStop(stopName: string): Promise<boolean> {
    if (this.hasStop(stopName)) {
      this.favouriteStops.splice(this.favouriteStops.indexOf(stopName), 1);
      await this.updateStoredFavourites();
      return true;
    } else {
      return false;
    }
  }

  private async updateStoredFavourites() {
    try {
      this.storage.set('favourites', this.favouriteStops);
    } catch(e) {
      console.log('error updating stored favourites', e.message);
    }
  }

  public getFavourites(): string[] {
    return this.favouriteStops;
  }
}
