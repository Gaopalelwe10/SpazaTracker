import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AlertController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';

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
  
  constructor( 
    private authService: AuthService,
    private Viewer : PhotoViewer,
    public afs: AngularFirestore,  
    private alertCtrl : AlertController,
    public afAuth: AngularFireAuth
    ) { 
    this.users=this.afs.collection('users', ref=>ref.orderBy('displayName')).valueChanges();
    this.currentuser=this.authService.getUID();
    console.log(this.currentuser)


    this.MUsers = afs.doc(`users/${authService.getUID()}`)
    
		this.sub = this.MUsers.valueChanges().subscribe(event => {
			this.username = event.displayName
			this.photoURL = event.photoURL
    })
  }

  ngOnInit() {
  
  }

  async presentAlertPrompt() {
    const alert = await this.alertCtrl.create({
      subHeader: 'Add/Edit Name',
      inputs: [
        {
          name: 'name1',
          type: 'text',
          value: this.username,
          placeholder: 'Placeholder 1'
        }
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
              displayName: inputData.name1
            })
            this.MUsers.update({
              displayName: inputData.name1
            })
           
          }
        }
      ]
    });
  }
}
