import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AlertController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/storage';
@Component({
 selector: 'app-profile',
 templateUrl: './profile.page.html',
 styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
 users:any;
 currentuser:string;
 private MUsers: AngularFirestoreDocument
    sub
    username: string;
 photoURL: string;

 
 id;
 name;
 url;



 uploadState: any;
 ref;
 downloadURL: any;
 constructor(
   private authService: AuthService,
   private Viewer : PhotoViewer,
   public afs: AngularFirestore,
   private alertCtrl : AlertController,
   public afAuth: AngularFireAuth,
   private route: Router,public Storage: AngularFireStorage
   ) {
   this.users=this.afs.collection('users', ref=>ref.orderBy('displayName')).valueChanges();
   this.currentuser=this.authService.getUID();
   console.log(this.currentuser)
   this.MUsers = afs.doc(`users/${authService.getUID()}`)
        this.sub = this.MUsers.valueChanges().subscribe(event => {
            this.username = event.displayName
            this.photoURL = event.photoURL
   })

   this.MUsers=afs.doc(`users/${this.afAuth.auth.currentUser.uid}`)
    this.sub=this.MUsers.valueChanges().subscribe(event=>{
      this.photoURL = event.photoURL
    })
 }
 ngOnInit() {
 }
 async NameUpdate(user) {
    const alert = await this.alertCtrl.create({
      subHeader: 'Add/Edit Name',
      inputs: [
        {
          name: 'displayName',
          type: 'text',
          value:user.displayName,
          placeholder: 'displayName'
        },
      
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        }, {
          text: 'Ok',
          handler: (inputData) => {
            console.log(inputData.name1)
            this.MUsers.update({
              
                displayName: inputData.displayName,
              })
           
          }
        }
      ]
    });
    await alert.present();
    let result = await alert.onDidDismiss();
  }
  async AddressUpdate(user) {
    const alert = await this.alertCtrl.create({
      subHeader: 'Add/Edit Name',
      inputs: [
 
        {
          name: 'Address',
          type: 'text',
          value:user.Address,
          placeholder: 'Address'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        }, {
          text: 'Ok',
          handler: (inputData) => {
            console.log(inputData.name1)
           
            this.MUsers.update({
              Address: inputData.Address,
             
            })
          }
        }
      ]
    });
    await alert.present();
    let result = await alert.onDidDismiss();
  }

 async update(user) {
   const alert = await this.alertCtrl.create({
     subHeader: 'Add/Edit Name',
     inputs: [
       {
         name: 'displayName',
         type: 'text',
         value:user.displayName,
         placeholder: 'displayName'
       },
       {
         name: 'Address',
         type: 'text',
         value:user.Address,
         placeholder: 'Address'
       },
     ],
     buttons: [
       {
         text: 'Cancel',
         role: 'cancel',
         cssClass: 'secondary',
         handler: () => {
         }
       }, {
         text: 'Ok',
         handler: (inputData) => {
           console.log(inputData.name1)
           this.afAuth.auth.currentUser.updateProfile({
             displayName: inputData.displayName,
           })
           this.MUsers.update({
             Address: inputData.Address,
             displayName: inputData.displayName,
           })
         }
       }
     ]
   });
   await alert.present();
   let result = await alert.onDidDismiss();
 }

 SpazaShop(){
   this.route.navigateByUrl("spazaform");
 }
 ico(){
   this.route.navigateByUrl("home");
 }

 upload(event) {
  const file= event.target.files[0];
 this.id = Math.random().toString(36).substring(2);
const filepath=this.id;
this.ref = this.Storage.ref(filepath);
const task = this.Storage.upload(filepath, file);

this.uploadState = task.percentageChanges();
task.snapshotChanges().pipe(
  finalize(() => {
    this.downloadURL = this.ref.getDownloadURL().subscribe(url=>{
       console.log(url);
       this.afAuth.auth.currentUser.updateProfile({
        photoURL: url
       })
       this.MUsers.update({
         photoURL: url
       })
     })
   })
 ).subscribe();
} 


}








