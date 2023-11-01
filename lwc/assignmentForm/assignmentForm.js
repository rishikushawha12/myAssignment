import { LightningElement, api,track} from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import assignmentInsert from '@salesforce/apex/AssignmentFormHandler.assignmentInsert';
import getAssignmentList from '@salesforce/apex/AssignmentFormHandler.getAssignmentList';
import {refreshApex} from '@salesforce/apex';
import { updateRecord } from 'lightning/uiRecordApi';
import Account_Name from '@salesforce/schema/Account.Name';
import Account_Id from '@salesforce/schema/Account.Id';
import Account_Industry from '@salesforce/schema/Account.Industry';
import Account_Description from '@salesforce/schema/Account.Description';
export default class AssignmentForm extends LightningElement {
    @api assignmentGroupId;
    
    @track value1 = '';
    @track value2 = '';
    @track IsDisabled = true;

    @track options = [
            { label: 'New Started', value: 'Not Started' },
            { label: 'In Progress', value: 'In Progress' },
            { label: 'Completed', value: 'Completed' },
        ];
    @track options2 = [
            { label: 'Low', value: 'Low' },
            { label: 'Medium', value: 'Medium' },
            { label: 'High', value: 'High' },
        ];

    @track option2 = []
    handleChange1(event) {
        this.value1 = event.detail.value;
        console.log('Values20'+JSON.stringify(this.value1));
        /*this.IsDisabled = false;
        this.option2 = this.options.filter(d=> d.value != this.value);
        console.log('Values23'+JSON.stringify(this.option2));*/
    };
    connectedCallback(){
        console.log('Record Id ==> '+ this.assignmentGroupId);
    }
    handleChange2(event){
        this.value2 = event.detail.value;
        console.log('Values28'+JSON.stringify(this.value2));
    }

    handleSubmit(event) {
        // Validate form fields
        const fields = this.template.querySelectorAll('lightning-input-field');
        console.log('Fields34'+fields);
        let isValid = true;

        fields.forEach(field => {
            console.log('Field===>>'+field);
            if (!field.value) {
                isValid = false;
                field.reportValidity();
            }
        });

        if (isValid) {
            this.createAssignmentRecord(event);
        }
    }

    createAssignmentRecord(event) {
        // Prepare assignment object and call Apex method
        event.preventDefault();
        const fields = event.detail.fields;
        fields.Status__c = this.value1;
        fields.Priority__c = this.value2;
        console.log(JSON.stringify(fields));
        assignmentInsert({ assignmnetToInsert: fields })
            .then((result) => {
                const evt = new ShowToastEvent({
                    title: 'Assignment Edit',
                    message: 'Successfully Created',
                    variant: 'success',
        
                });
                
                this.dispatchEvent(evt);
            })
            .catch((error) => {
                console.log(error);
            });
        //this.template.querySelector('lightning-record-edit-form').submit(fields);
    }

    handleSuccess(event) {
     
        const evt = new ShowToastEvent({
            title: 'Assignment Created',
            message: 'Record ID: ' + event.detail.id,
            variant: 'success',

        });
        
        this.dispatchEvent(evt);

    }
    // 
    // handleSubmit(event){
    //     event.preventDefault();
    //     const fields = event.detail.fields;
    //     console.log('FIELDS83'+fields);
    //     if((!fields.Name || !fields.Due_Date__c || !fields.Description__c || !fields.Title__c || !fields.Status__c || !fields.Priority__c )){
    //         this.ShowToastEvent('Error', 'All Fields are required', 'error','error','error','error');
    //     } else {
    //         this.submitAssignment(fields);
    //     }
    // }
    // submitAssignment(fields){
    //     AssignmentInsert({assignmentFields: fields})
    //         .then(result =>{
    //             this.ShowToast('Success','Assignment save sucessfullt','Success','Success','Success','Success');
    //             refreshApex(this.getAssignmentList);
    //         });
    // }
    // ShowToast(title, message, variant)  {
    //     const event = new ShowToastEvent({
    //         title: title,
    //         message: message,
    //         variant: variant,
    //     });
    //     this.dispatchEvent(event);
    // }

}