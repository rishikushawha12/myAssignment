public class AssignmentHandler {
    @AuraEnabled
    public static void assignmentInsert(Map<String,Object> assignmnetToInsert){
        Assignment__c assRec = new Assignment__c();
        if(!assignmnetToInsert.isEmpty()){
            for(String key : assignmnetToInsert.keySet()){
                if(key.equals('DueDate__c')){
                    Datetime duedateTime = (DateTime)JSON.deserialize('"' + assignmnetToInsert.get(key)+'"', DateTime.class);
                    assRec.put(key, duedateTime);
                }else{
                    assRec.put(key, assignmnetToInsert.get(key));
                }
            }
            try{
                insert assRec;

            }catch(DMLException ex){
                System.debug(ex.getMessage());
            }
        }
    }


    @AuraEnabled(cacheable=true)
    public static List<Assignment__c> getAssignmentList(){
        return [SELECT Id, Name, Title__c, Priority__c, Status__c, DueDate__c FROM Assignment__c];
    }
}