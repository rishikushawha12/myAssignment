import { LightningElement,wire,track,api } from 'lwc';
import getAssignment from '@salesforce/apex/AssignmentController.getAssignment';
import { refreshApex } from '@salesforce/apex';
const actions = [{ label: 'Edit', name: 'Edit' },];
const columns = [ { label: 'AssignmentName', fieldName: 'Name',type:'text'},
                  { label: 'Description', fieldName: 'Description__c',type:'Long Text Area'},
                  { label: 'DueDate', fieldName: 'DueDate__c', type: 'Date/Time', sortable: "true"},
                  { label:'Priority', fieldName: 'Priority__c', type: 'picklist'},
                  {label:'Status', fieldName:'Status__c',type:'picklist'},
                  {label:'Title', fieldName:'Title__c', type:'text'},
                  {type: 'action',typeAttributes: { rowActions: actions },}
                ];

  

export default class AssignmentList extends LightningElement {

  @track value;
  @track error;
  @track data;
  @api sortedDirection = 'asc';
  @api sortedBy = 'Name';
  @api searchKey = '';
  result;
  @track formLabel = '';
  @track dataAll;
  @track allSelectedRows = [];
  @track page = 1; 
  @track items = []; 
  @track data = []; 
  @track columns; 
  @track startingRecord = 1;
  @track endingRecord = 0; 
  @track pageSize = 5; 
  @track totalRecountCount = 0;
  @track totalPage = 0;
  isPageChanged = false;
  initialLoad = true;
  mapoppNameVsOpp = new Map();;

  @wire(getAssignment, {searchKey: '$searchKey', sortBy: '$sortedBy', sortDirection: '$sortedDirection'})
  wiredAccounts(result) {
    this.dataAll = result;
      if (result.data) {
          this.processRecords(result.data);
          this.error = undefined;
      } else if (result.error) {
          this.error = result.error;
          this.data = undefined;
      }
  }
  assignmentGroupId;
  @track isShowModal = false;
  navigateToEdit(event){
    this.assignmentGroupId = event.detail?.row?.Id;
    this.formLabel = 'Edit Assignment';
    this.isShowModal = true;
    console.log('Record Id ==> '+ this.assignmentGroupId);
  }
  creteNewRecord(){
    this.assignmentGroupId =undefined;
    this.formLabel = 'Create Assignment';
    this.isShowModal = true;
  }
  hideModalBox() { 

    this.isShowModal = false;
    this.assignmentGroupId =undefined;
}
  processRecords(data){
      this.items = data;
      console.log('DATA&&&&'+JSON.stringify(this.items));
          this.totalRecountCount = data.length; 
          this.totalPage = Math.ceil(this.totalRecountCount / this.pageSize); 
          
          this.data = this.items.slice(0,this.pageSize); 
          this.endingRecord = this.pageSize;
          this.columns = columns;
  }
  //clicking on previous button this method will be called
  previousHandler() {
      this.isPageChanged = true;
      if (this.page > 1) {
          this.page = this.page - 1; //decrease page by 1
          this.displayRecordPerPage(this.page);
      }
        var selectedIds = [];
        for(var i=0; i<this.allSelectedRows.length;i++){
          selectedIds.push(this.allSelectedRows[i].Id);
        }
      this.template.querySelector(
          '[data-id="table"]'
        ).selectedRows = selectedIds;
  }

  //clicking on next button this method will be called
  nextHandler() {
      this.isPageChanged = true;
      if((this.page<this.totalPage) && this.page !== this.totalPage){
          this.page = this.page + 1; //increase page by 1
          this.displayRecordPerPage(this.page);            
      }
        var selectedIds = [];
        for(var i=0; i<this.allSelectedRows.length;i++){
          selectedIds.push(this.allSelectedRows[i].Id);
        }
      this.template.querySelector(
          '[data-id="table"]'
        ).selectedRows = selectedIds;
  }

  //this method displays records page by page
  displayRecordPerPage(page){

      this.startingRecord = ((page -1) * this.pageSize) ;
      this.endingRecord = (this.pageSize * page);

      this.endingRecord = (this.endingRecord > this.totalRecountCount) 
                          ? this.totalRecountCount : this.endingRecord; 

      this.data = this.items.slice(this.startingRecord, this.endingRecord);
      this.startingRecord = this.startingRecord + 1;
  }    
  
  sortColumns( event ) {
      this.sortedBy = event.detail.fieldName;
      this.sortedDirection = event.detail.sortDirection;
      return refreshApex(this.result);
      
  }
  
  onRowSelection(event){
      if(!this.isPageChanged || this.initialLoad){
          if(this.initialLoad) this.initialLoad = false;
          this.processSelectedRows(event.detail.selectedRows);
      }else{
          this.isPageChanged = false;
          this.initialLoad =true;
      }
      
  }
  processSelectedRows(selectedAssig){
      var newMap = new Map();
      for(var i=0; i<selectedAssig.length;i++){
          if(!this.allSelectedRows.includes(selectedAssig[i])){
              this.allSelectedRows.push (selectedAssig[i]);
          }
          this.mapoppNameVsOpp.set(selectedAssig[i].Title__c, selectedAssig[i]);
          this.mapoppNameVsOpp.set(selectedAssig[i].Priority__c, selectedAssig[i]);
          newMap.set(selectedAssig[i].Title__c,selectedAssig[i]);
          newMap.set(selectedAssig[i].Priority__c,selectedAssig[i]);
        
      }
      for(let [key,value] of this.mapoppNameVsOpp.entries()){
          if(newMap.size<=0 || (!newMap.has(key) && this.initialLoad)){
              const index = this.allSelectedRows.indexOf(value);
              if (index > -1) {
                  this.allSelectedRows.splice(index, 1); 
              }
          }
      }
  }
  
  handleKeyChange( event ) {
      this.searchKey = event.target.value;
      console.log("SEARCH######"+ this.searchKey);
      var data = [];
      console.log("Data145"+ JSON.stringify(data));
      for(var i=0; i<this.items.length;i++){
          if(this.items[i]!= undefined && this.items[i].Title__c.includes(this.searchKey) && this.items[i].Priority__c.includes(this.searchKey)){
              data.push(this.items[i]);
          }
        }
      this.processRecords(data);
      //console.log("DATA152"+this.processRecords(data));
  }
 @api refershSearch(){
    this.searchKey='';
    return refreshApex(this.dataAll);

}
  }