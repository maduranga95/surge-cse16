import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginServiceService } from '../services/login-service.service';
import {CookieService} from 'angular2-cookie/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  uname : string;
  pass : string;
  usrdata : any;
  fulldata : any;
  constructor(private lservice : LoginServiceService, private router:Router, private logincookie : CookieService ) { }

  ngOnInit() {
    var x = this.logincookie.get("uname");
    if(x){
      if(this.logincookie.get("role") == "admin"){
        this.router.navigate(['admin/home',{details: btoa(x)}]);
      }else{

      }this.router.navigate(['teacher/home',{details: btoa(x)}]);

    }
  }

  Auth(): void {
    this.lservice.login(this.uname,this.pass).subscribe(data => {
      this.usrdata = data;
      if (this.usrdata == null){
        console.log("invalid username");
      }else if (this.usrdata.Password != this.pass){
        console.log("invalid Password", this.usrdata.password , this.pass);
      }else{
        /*if (this.usrdata.role == "teacher"){
          this.router.navigate(['teacher/',{details: btoa(this.uname)}]);
        }
        if(this.usrdata.role == "'ExamDiv'"){
          this.lservice.loginemployee(this.uname).subscribe(data => {
            this.fulldata = data;
            console.log(data);
          });
        }*/ // after examdiv and teacher are completed
        if(this.usrdata.role == "'admin'" || this.usrdata.role == "admin"){
          this.lservice.loginemployee(this.uname).subscribe(data=>{
            this.fulldata = data;
            console.log(data.Address);
            this.logincookie.put("econtact",this.fulldata.econtact);
            this.logincookie.put("byear",this.fulldata.bday.year);
            this.logincookie.put("bmonth",this.fulldata.bday.month);
            this.logincookie.put("bdate",this.fulldata.bday.day);
            this.logincookie.put("NIC", this.fulldata.NIC);
            this.logincookie.put("contact", this.fulldata.contact);
            this.logincookie.put("email", this.fulldata.email);
            this.logincookie.put("fname", this.fulldata.fname);
            this.logincookie.put("Address", this.fulldata.Address);
          });
          this.lservice.loginuser(this.uname);
          this.logincookie.put("uname",this.uname);
          this.logincookie.put("role",this.usrdata.role);
          this.router.navigate(['admin/home',{details: btoa(this.uname)}]);
        }else if(this.usrdata.role == "teacher"){
          this.lservice.loginteacher(this.uname).subscribe(data=>{
            this.fulldata = data;
            console.log(data.Address);
            this.logincookie.put("econtact",this.fulldata.econtact);
            this.logincookie.put("byear",this.fulldata.bday.year);
            this.logincookie.put("bmonth",this.fulldata.bday.month);
            this.logincookie.put("bdate",this.fulldata.bday.day);
            this.logincookie.put("NIC", this.fulldata.NIC);
            this.logincookie.put("contact", this.fulldata.contact);
            this.logincookie.put("email", this.fulldata.email);
            this.logincookie.put("fname", this.fulldata.fname);
            this.logincookie.put("Address", this.fulldata.Address);
          });
          this.lservice.loginuser(this.uname);
          this.logincookie.put("uname",this.uname);
          this.logincookie.put("role",this.usrdata.role);
          this.router.navigate(['teacher/home',{details: btoa(this.uname)}]);
        }
      }
    });
  }
}
