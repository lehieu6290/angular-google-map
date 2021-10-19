export class Address
{
    route: string; //Street
    locality: string; //City
    administrative_area_level_1: string; //State
    postal_code: string; //Zipcode
    country: string

    constructor() {
        this.route = '';
        this.locality = '';
        this.administrative_area_level_1 = '';
        this.postal_code = '';    
        this.country = '';    
    }
}