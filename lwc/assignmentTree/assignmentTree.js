import {LightningElement ,track,wire} from 'lwc';
import  getAssignment from '@salesforce/apex/assignmentTreeController.getAssignment';

export default class AssignmentTree extends LightningElement {
    assignmentGroups;
    error;
  @track expandedRows = [];
    @wire(getAssignment)
    wiredAssignment({ error, data }) {
      if (data) {
        let parseData = JSON.parse(JSON.stringify(data));
        for (let i = 0; i < parseData.length; i++) {
          parseData[i]._children = parseData[i]["Assignments__r"];
        }
        this.assignmentGroups = parseData;
      } else if (error) {
        this.error = error;
        this.assignmentGroups = undefined;
      } 
    }
      constructor() {
        super();
        this.columns = [
          {
            type: "text",
            fieldName: "GroupName__c",
            label: "GroupName"
          },
          {
            type: "text",
            fieldName: "GroupDescription__c",
            label: "GroupDescription"
          },
          {
            type: "text",
            fieldName: "Name",
            label: "Assignment Name"
          },
          {
            type: "text",
            fieldName: "Description__c",
            label: "Description"
          },
          {
            type: "Date/Time",
            fieldName: "DueDate__c",
            label: "DueDate"
          },
          {
            type: "text",
            fieldName: "Status__c",
            label: "Status"
          },
          {
            type: "text",
            fieldName: "Title__c",
            label: "Title"
          },
          {
            type: "text",
            fieldName: "Priority__c",
            label: "Priority"
          },
          
        ];
        }
        get expandedRowItems() {
            return this.expandedRows;
          }
          
}