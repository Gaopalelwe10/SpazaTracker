import { Component, ElementRef, ViewChild } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { Geolocation } from '@ionic-native/geolocation/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @ViewChild('map', {static: false}) mapNativeElement: ElementRef
  map: any;

  startPosition: any;
  originPosition: string;
  destinationPosition: string;

  constructor(public menuCtrl: MenuController,private authService: AuthService , public geolocation : Geolocation) {}
  ionViewWillEnter() {
    this.menuCtrl.enable(true);
  }


  ionViewDidEnter() {
    this.initializeMapBox();
  }
  
  initializeMapBox() {


    // or "const mapboxgl = require('mapbox-gl');"
    mapboxgl.accessToken = 'pk.eyJ1Ijoibm51bnUiLCJhIjoiY2p4cTIxazB3MG0wYTNncm4wanF0cDVjaiJ9.v0khvZZss9z_U2MroA2PVQ';
    const map = new mapboxgl.Map({
      container: this.mapNativeElement.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v9',
      zoom: 10,
      // center: [lng, lat],
      center: [	28.218370, -25.731340] 
    });

    map.addControl(new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      marker: {
        color: 'orange'
        },
      mapboxgl: mapboxgl,
      
    }));

    this.geolocation.getCurrentPosition()
      .then((response) => {
        this.startPosition = response.coords;
        map.setCenter([this.startPosition.longitude, this.startPosition.latitude]);

        var marker = new mapboxgl.Marker()
          .setLngLat([this.startPosition.longitude, this.startPosition.latitude])
          .addTo(map);
      })

  }
}
