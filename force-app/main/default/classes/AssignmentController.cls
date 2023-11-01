public with sharing class AssignmentController {
    @AuraEnabled(cacheable=true)
public static List<Assignment__c> getAssignment(String searchKey, String sortBy,String sortDirection){
    
    String query='SELECT Id,Name,Description__c,DueDate__c,Priority__c,Status__c,Title__c from Assignment__c';
    system.debug('query---'+query);
    if ( searchKey != null && searchKey != '' ) {
        String key = '%' + searchKey + '%';
        query += ' WHERE (Priority__c LIKE :key OR Title__c LIKE :key)';
        //query += ' WHERE Priority__c  LIKE :key';
        //query += 'WHERE Title__c LIKE :key';
    }
    if ( sortBy != null && sortDirection != null ) {
        query += ' ORDER BY ' + sortBy + ' ' + sortDirection;
    }
    return Database.query( query );
}
}