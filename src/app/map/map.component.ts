import { MapsAPILoader } from '@agm/core';
import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { Address } from '../Address';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  latitude: number;
  longitude: number;
  zoom: number;
  private geoCoder;
  
  @ViewChild('search') public searchElementRef: ElementRef<HTMLInputElement>;
  @ViewChild('streetField') public streetField: ElementRef<HTMLInputElement>;
  @ViewChild('cityField') public cityField: ElementRef<HTMLInputElement>;
  @ViewChild('stateField') public stateField: ElementRef<HTMLInputElement>;
  @ViewChild('countryField') public countryField: ElementRef<HTMLInputElement>;
  @ViewChild('zipcodeField') public zipcodeField: ElementRef<HTMLInputElement>;
  
  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone
  ) { }
  
  ngOnInit() {
    this.mapsAPILoader.load().then(() => {
      this.setCurrentLocation();
      this.geoCoder = new google.maps.Geocoder;
  
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();
  
          if (place.geometry === undefined || place.geometry === null) return;
  
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.zoom = 17;
          
          this.showAddressDetail(place);
        });
      });
    });
  }
  
  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.getAddress(this.latitude, this.longitude);
      });
    }
  }
  
  getAddress(latitude, longitude) {
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
      if (status === 'OK' && results[0]) {
        this.zoom = 17;
        this.showAddressDetail(results[0]);
      }  
    });
  }

  showAddressDetail(place: any){

    let googleAddress = new Address();

    place.address_components.forEach(item => {
        var addressType = item.types[0];
        if (addressType in googleAddress) {
          var val = item.long_name;
          googleAddress[addressType] = val;
        }
    });

    this.streetField.nativeElement.value = googleAddress.route;
    this.cityField.nativeElement.value = googleAddress.locality;
    this.stateField.nativeElement.value = googleAddress.administrative_area_level_1;
    this.countryField.nativeElement.value = googleAddress.country;
    this.zipcodeField.nativeElement.value = googleAddress.postal_code;

  }
}
