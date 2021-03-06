import { Component, OnInit } from '@angular/core';
import { Batch } from '../../models/batch';
import { LoadbatchesService } from '../../services/loadbatches.service';
import { Student } from '../../models/student';
import { LoginServiceService } from '../../services/login-service.service';
import { GridOptions } from "ag-grid";
import { Observable } from 'rxjs/Observable';
@Component({
  selector: 'app-create-student',
  templateUrl: './create-student.component.html',
  styleUrls: ['./create-student.component.css']
})
export class CreateStudentComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  name : string;
  phone : string;
  nextid : number;
  cstudent : Student = <Student>{};
  SStudents: any;
  selected: string;
  sbatch : Batch;
  batches : Batch[];
  columnDefs : any[];
  rowData : any[];
  rowSelection : any;
  gridApi : any;
  gridColumnApi : any;
  selectedRows : Student[] = [];
  DCCRows : Student = <Student>{};
  NICtaken : Observable<boolean>;

  constructor(private _batchservice: LoadbatchesService,
    private _loginservice : LoginServiceService) {
      this.columnDefs = [
            {headerName: "", field:"", checkboxSelection: true, headerCheckboxSelection: true},
            {headerName: "ID", field: "ID", width: 350},
            {headerName: "Name", field: "fname", width: 475},
            {headerName: "NIC", field: "NIC", width: 350},

        ];
        this.rowSelection = "multiple";
    }

    SendtoNextlevel(){
      var i : number = 0;
      for (i=0;i<this.selectedRows.length;i++){
        this._batchservice.NextLevel(this.selectedRows[i].username,this.selected,this.SStudents.length);
      }
      this.SStudents = this._batchservice.listStudents(this.selected);
      this.gridApi.setRowData(this.SStudents);
    }

    Deletebutton(){
      var i : number = 0;
      for (i=0;i<this.selectedRows.length;i++){
        this._loginservice.removeUser(this.selectedRows[i].username);
        this._batchservice.saveBatchlist(this.selectedRows[i].username,this.selected,this.SStudents.length);
      }
      this.SStudents = this._batchservice.listStudents(this.selected);
      this.gridApi.setRowData(this.SStudents);
    }
    checkValidity(){
      this.NICtaken = this._loginservice.checkNICs(this.cstudent.NIC);
    }

    onGridReady(params) {
      this.gridApi = params.api;
      this.gridColumnApi = params.columnApi;
    }

    onSelectionChanged($event){
      this.selectedRows = this.gridApi.getSelectedRows();
      console.log(this.selectedRows);
    }

    onRDC($event){
      this.DCCRows = this.gridApi.getSelectedRows()[0];
      console.log(this.DCCRows);
      $('#save').click();
    }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      info: false,
      language: {
        emptyTable: "Click on a Student to see more details",
        zeroRecords : ""
      }
    };
    this._batchservice.listBatches()
        .subscribe(students => {
          console.log(students);
          this.batches = students;
        });

  }

  clear(){
    this.cstudent.fname = "";
    this.cstudent.NIC = "";
    this.cstudent.Address = "";
    this.cstudent.contact = "";
    this.cstudent.email = "";
    $('#div4').prop('hidden','true');
  }

  AddStudent(){
    this.cstudent.batchcode = this.sbatch.name;
    this.cstudent.bindex = this.selected;
    this.cstudent.Level = "Entry";
    this.cstudent.password = "student123";
    this.cstudent.role = "student";
      if (this.nextid < 10){
        this.cstudent.ID = this.cstudent.batchcode+"000"+this.nextid;
      }else if (this.nextid < 100){
        this.cstudent.ID = this.cstudent.batchcode+"00"+this.nextid;
      }else if (this.nextid < 1000){
        this.cstudent.ID = this.cstudent.batchcode+"0"+this.nextid;
      }else{
        this.cstudent.ID = this.cstudent.batchcode+this.nextid;
      }
      this.nextid = this.nextid + 1 ;
      this.cstudent.username = this.cstudent.ID;
      this._batchservice.Addnewstudent(this.cstudent, this.SStudents.length , this.nextid);
    this._loginservice.adduser(this.cstudent);
    this.cstudent.fname = "";
    this.cstudent.NIC = "";
    this.cstudent.Address = "";
    this.cstudent.contact = "";
    this.cstudent.email = "";
    $('#button79').click();
    this.SStudents = this._batchservice.listStudents(this.selected);
    this.gridApi.setRowData(this.SStudents);
  }

  changebatch(batchno,batch){
    batch.active = !batch.active;
    this.selected = batchno;
    this.sbatch = batch;
    this.nextid = batch.nextid;
    this.SStudents = this._batchservice.listStudents(this.selected);
    this.gridApi.setRowData(this.SStudents);
      //this.rowData = this.SStudents;

  }

}
