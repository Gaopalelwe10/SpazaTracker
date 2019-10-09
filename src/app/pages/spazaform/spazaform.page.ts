import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { MapboxService, Feature } from 'src/app/services/mapbox.service';
import { IfStmt } from '@angular/compiler';

@Component({
  selector: 'app-spazaform',
  templateUrl: './spazaform.page.html',
  styleUrls: ['./spazaform.page.scss'],
})
export class SpazaformPage implements OnInit {

  form: FormGroup;
  map: any;

  itemList;
  marker?: any;
  startPosition;


  addresses: string[] = [];
  coodinateses: string[] = [];

  selectedAddress = null;
  selectedcoodinates = null;

  uploadPercent: Observable<number>;
  downloadU: any;
  uniqkey: any;
  today: any = new Date();
  date = this.today.getDate() + "" + (this.today.getMonth() + 1) + "" + this.today.getFullYear();
  time = this.today.getHours() + "" + this.today.getMinutes();
  dateTime = this.date + "" + this.time;
  urlPath: any;

  lng;
  lat;
  constructor(private fb: FormBuilder, private afAuth: AngularFireAuth, private afs: AngularFirestore, private route: Router, private storage: AngularFireStorage, public mapboxService: MapboxService) {
    this.form = fb.group({
      Spaza: ['', Validators.compose([Validators.pattern('[a-zA-Z ]*'), Validators.minLength(4), Validators.maxLength(30), Validators.required])],
      Discription: ['', Validators.compose([Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      Address: ['', Validators.required],
      Hours: ['', Validators.required],
      Number: ['', Validators.required]
    });
  }

  ngOnInit() {
  }

  Pic(event) {
    const file = event.target.files[0];
    this.uniqkey = 'PIC' + this.dateTime;
    const filePath = this.uniqkey;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    // observe percentage changes
    this.uploadPercent = task.percentageChanges();


    task.snapshotChanges().pipe(
      finalize(() => {
        this.downloadU = fileRef.getDownloadURL().subscribe(urlPath => {
          console.log(urlPath);
          this.urlPath = urlPath
          this.uploadPercent = null;
        });
      })
    ).subscribe();
  }

  

  search(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    if (searchTerm && searchTerm.length > 0 ) {
      this.mapboxService.search_word(searchTerm)
        .subscribe((features: Feature[]) => {
          this.coodinateses = features.map(feat =>  feat.geometry)
          this.addresses = features.map(feat => feat.place_name,)
          
          console.log(features)
        });
    } else {
      this.addresses = [];
    }
  }
  onSelect(address, coodinates) {
    this.selectedAddress = address;
    //  selectedcoodinates=

      console.log("lng:" +coodinates.coordinates[0])
      console.log("lat:"+ coodinates.coordinates[1])
    this.lng=coodinates.coordinates[0];
    this.lat=coodinates.coordinates[1];
    
   
    console.log( this.selectedAddress )
    console.log(coodinates)
    //add to FireBase
    // this.dog.collection('coordinate').add({
    //   lat: this.temp.coordinates[1],
    //   lng: this.temp.coordinates[0],
    //   address: address,
    // }).then(function (ref) {
    //   console.log("document was written with ID : " + ref);
    //   alert("physical address : " + address + " , saved successful..")
    // }).catch(function (ee) {
    //   console.log(ee)
    //   console.log("error while processing ..")
    // });
    this.addresses = [];
  }
  Submit() {
    this.afs.collection('spazashop').doc(this.afAuth.auth.currentUser.uid).set({
      spazaName: this.form.value.Spaza,
      uid: this.afAuth.auth.currentUser.uid,
      Timestamp: Date.now(),
      Discription: this.form.value.Discription,
      Address: this.form.value.Address,
      Hours: this.form.value.Hours,
      Number: this.form.value.Number,
      photoURL: this.urlPath,
      Registered: "yes",
      lat: this.lat,
      lng: this.lng,
    }).then(() => {
      this.route.navigateByUrl("spazaboard")
    }).catch(err => {
      alert(err.message)
    })
    this.urlPath = "";
  }
}
