import { Injectable } from '@angular/core';
declare var firebase : any;
import { UploadserviceService } from './uploadservice.service';

@Injectable()
export class NoticeserviceService {

  constructor(private _upload : UploadserviceService) { }

  postnotice(sub , des , date, files){
    const pushrequest = firebase.database().ref('notices').push({
      subject : sub,
      description : des,
      enddate : date
    });
    const pushkey = pushrequest.key;
    console.log(pushkey);
    console.log(files);
    this._upload.uploadNoticefiles(pushkey,files);
  }

  getnotices(){
    return firebase.database().ref('/notices');
  }

  deletenotice(key){
    firebase.database().ref('/notices/'+key+'/files').on("child_added", snapshot => {
      var x = snapshot.val().filename ;
      firebase.storage().ref('/notices/'+key+'/'+x).delete();
    })
    firebase.database().ref('/notices/' + key).remove();
  }

}
