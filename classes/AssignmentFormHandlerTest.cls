@isTest
private class AssignmentFormHandlerTest {

    @isTest
    static void testAssignmentInsert() {
        Map<String, Object> assignmentData = new Map<String, Object>{
            'Name' => 'Test Assignment',
            'Title__c' => 'Test Title',
            'Priority__c' => 'High',
            'Status__c' => 'In Progress',
            'DueDate__c' => System.now().addDays(5)
        };

        Test.startTest();
        AssignmentFormHandler.assignmentInsert(assignmentData);
        Test.stopTest();

        Assignment__c insertedAssignment = [SELECT Id, Name, Title__c, Priority__c, Status__c, DueDate__c FROM Assignment__c WHERE Name = 'Test Assignment' LIMIT 1];

        System.assertNotEquals(null, insertedAssignment);
        System.assertEquals('Test Assignment', insertedAssignment.Name);
        System.assertEquals('Test Title', insertedAssignment.Title__c);
        System.assertEquals('High', insertedAssignment.Priority__c);
        System.assertEquals('In Progress', insertedAssignment.Status__c);
    }

    @isTest
    static void testGetAssignmentList() {
        List<Assignment__c> assignments = AssignmentFormHandler.getAssignmentList();
        System.assertNotEquals(null, assignments);
    }
}