import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-spazaform',
  templateUrl: './spazaform.page.html',
  styleUrls: ['./spazaform.page.scss'],
})
export class SpazaformPage implements OnInit {

  form: FormGroup;
constructor(private fb: FormBuilder, private afAuth : AngularFireAuth, private afs :AngularFirestore,private route : Router) {
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

  Submit() {    
      this.afs.collection('spazashop').doc(this.afAuth.auth.currentUser.uid).set({
        Spaza:this. form.value.Spaza,   
        uid: this.afAuth.auth.currentUser.uid,
        Timestamp:Date.now(),
        Discription:this.form.value.Discription,
        Address:this. form.value.Address,
        Hours:this. form.value.Hours,
        Number:this. form.value.Number,
        photoURL:"", 
      }).then(()=>{
        this.route.navigateByUrl("spazaboard")
      }).catch(err=>{
        alert(err.message)
      })

  }
}
