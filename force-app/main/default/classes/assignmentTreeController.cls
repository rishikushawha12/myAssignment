public with sharing class assignmentTreeController {
   @AuraEnabled(Cacheable=true)
 public static List<AssignmentGroup__c> getAssignment(){
  List<AssignmentGroup__c> asslist = [ SELECT Id, GroupName__c, GroupDescription__c, (SELECT Id, Name, Description__c, DueDate__c, Priority__c, Status__c, Title__c FROM Assignments__r) FROM AssignmentGroup__c];
  return asslist;
 }
  
}