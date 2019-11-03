//const logging = require('fs');
class QOperator {
   constructor(operator,customers,priority) {
      this.operator=operator
      this.customers=customers
      this.priority=priority
   }
}

class PQueue {
   constructor() {
      this.operators=[]
   }
  
   isEmpty() {
      return !this.operators.length
   }

   enqueue(operator,customers,priority) {
      //console.log("\t\tenqueue("+operator+" --- "+customers+" --- "+priority+")\n---------------------------------------------------------------------------")
      //logging.appendFile('logs.txt',"\n\t\tenqueue("+operator+" --- "+customers+" --- "+priority+")\n---------------------------------------------------------------------------",(err)=>{
         //if(err) throw err
      //})
      var qOperator=new QOperator(operator,customers,priority)
      var flag=false

      for (var i=0;i<this.operators.length;i++) {
         if(this.operators[i].priority > qOperator.priority) {
            this.operators.splice(i,0,qOperator)
            flag=true
            break
         }
      }

      if(!flag)
         this.operators.push(qOperator)
   }

   dequeue() {
      //console.log("\t\tdequeue()\n---------------------------------------------------------------------------")
      //logging.appendFile('logs.txt',"\n\t\tdequeue()\n---------------------------------------------------------------------------",(err)=>{
         //if(err) throw err
      //})
      if(this.isEmpty())   return 'EMPTY'
      return this.operators.shift()
   }

   size() {
      return this.operators.length
   }

   addOperator(operator) {
      //console.log("\t\taddOperator("+operator+")\n---------------------------------------------------------------------------")
      //logging.appendFile('logs.txt',"\n\t\taddOperator("+operator+")\n---------------------------------------------------------------------------",(err)=>{
         //if(err) throw err
      //})
      this.enqueue(operator,[],0)
   }

   deleteOperator(operator,database) {
      //console.log("\t\tdeleteOperator("+operator+")\n---------------------------------------------------------------------------")
      //logging.appendFile('logs.txt',"\n\t\tdeleteOperator("+operator+")\n---------------------------------------------------------------------------",(err)=>{
         //if(err) throw err
      //})
      var returnValue
      var found=false
      for (var i = 0; i < this.operators.length; i++) {
         if(this.operators[i].operator==operator) {
            returnValue=this.operators[i]
            this.operators.splice(i,1)
            found=true
            break
         }
      }
      if(!found)
         return null

      for (var i = 0; i < returnValue.customers.length; i++) {
         this.assignCustomer(returnValue.customers[i],database);
      }
      return returnValue
   }

   removeOperatorFromQueue(operator) {
      //console.log("\t\tremoveOperatorFromQueue("+operator.key+")\n---------------------------------------------------------------------------")
      //logging.appendFile('logs.txt',"\n\t\tremoveOperatorFromQueue("+operator.key+")\n---------------------------------------------------------------------------",(err)=>{
         //if(err) throw err
      //})
      for (var i = 0; i < this.operators.length; i++) {
         if(this.operators[i].operator==operator) {
            let temp=this.operators[i]
            this.operators.splice(i,1)
            return temp
         }
      }
      return null
   }

   addOperatorToQueue(Operator,pausedOperatorsList) {
      //console.log("\t\taddOperatorToQueue("+Operator.key+")\n---------------------------------------------------------------------------")
      //logging.appendFile('logs.txt',"\n\t\taddOperatorToQueue("+Operator.key+")\n---------------------------------------------------------------------------",(err)=>{
         //if(err) throw err
      //})
      for (var i=pausedOperatorsList.length-1;i>=0;i--) {
         if(pausedOperatorsList[i].operator==Operator) {
            this.enqueue(pausedOperatorsList[i].operator,pausedOperatorsList[i].customers,pausedOperatorsList[i].priority)
            return
         }
      }
   }

   assignCustomer(customer,database) {
      //console.log("\t\tassignCustomer("+customer.child('fName').val()+' '+customer.child('lName').val()+")\n---------------------------------------------------------------------------")
      //logging.appendFile('logs.txt',"\n\t\tassignCustomer("+customer.child('fName').val()+' '+customer.child('lName').val()+")\n---------------------------------------------------------------------------",(err)=>{
         //if(err) throw err
      //})
      let operator=this.dequeue()
      if(operator!='EMPTY') {
         operator.customers.push(customer)
         this.enqueue(operator.operator,operator.customers,++(operator.priority))

         let x=database.child('operators/'+operator.operator+'/customers').push()
         x.set({
            id:customer.child('id').val(),
            fName:customer.child('fName').val(),
            lName:customer.child('lName').val()
         })
         database.child('customers/'+customer.key).remove();

         return operator.operator
      }
      return null
   }

   deleteCustomer(customer) {
      //console.log("\t\tdeleteCustomer("+customer+")\n---------------------------------------------------------------------------")
      //logging.appendFile('logs.txt',"\n\t\tdeleteCustomer("+customer+")\n---------------------------------------------------------------------------",(err)=>{
         //if(err) throw err
      //})
      var Operator=null
      for (var i = 0; i < this.operators.length; i++) {
         for (var j = 0; j < this.operators[i].customers.length; j++) {
            if(this.operators[i].customers[j].key==customer) {
               Operator=this.operators[i]
               this.operators.splice(i,1)
               Operator.customers.splice(j,1)
               Operator.priority--
               this.enqueue(Operator.operator,Operator.customers,Operator.priority)
               break
            }
         }
      }
      return Operator
   }

   printCustomers(operator) {
      //console.log("\t\tprintCustomers("+operator+")\n---------------------------------------------------------------------------")
      //logging.appendFile('logs.txt',"\n\t\tprintCustomers("+operator+")\n---------------------------------------------------------------------------",(err)=>{
         //if(err) throw err
      //})
      let cu='';
      for (var i = 0; i < this.operators.length; i++) {
         if(this.operators[i].operator==operator) {
            for (var j = 0; j < this.operators[i].customers.length; j++) {
               cu+=' ('+this.operators[i].customers[j]+') '
            }
         }
      }
      return cu
   }

   printPQueue() {
      //console.log("\t\tprintPQueue()\n---------------------------------------------------------------------------")
      //logging.appendFile('logs.txt',"\n\t\tprintPQueue()\n---------------------------------------------------------------------------",(err)=>{
         //if(err) throw err
      //})
      let qu=''
      for (var i=0;i<this.operators.length;i++)
         qu+=this.operators[i].operator+'('+this.operators[i].priority+') --> '
      qu+='NULL'
      return qu
   }
}
module.exports = PQueue;

/*
var faisal = new PQueue();
console.log('isEmpty(): '+faisal.isEmpty());

let cu1=[]
cu1.push('Tony')
cu1.push('Iron Man')
faisal.enqueue("Stark",cu1,2);

let cu2=[]
cu2.push('Bruce')
cu2.push('The Hulk')
faisal.enqueue("Banner",cu2,1);

let cu3=[]
cu3.push('Steve')
cu3.push('Captain America')
faisal.enqueue("Rogers",cu3,1);

let cu4=[]
cu4.push('Natasha')
cu4.push('Black Widow')
faisal.enqueue("Romanoff",cu4,2);

let cu5=[]
cu5.push('Thor')
faisal.enqueue("Odinson",cu5,3);

console.log('printPQueue(): '+faisal.printPQueue());

console.log('dequeue(): '+faisal.dequeue().operator);

console.log('printPQueue(): '+faisal.printPQueue());

faisal.deleteOperator("Banner");
console.log('deleteOperator("Banner")');

console.log('printPQueue(): '+faisal.printPQueue());

console.log('printCustomers("Romanoff"): '+faisal.printCustomers("Romanoff"));
console.log('printCustomers("Odinson"): '+faisal.printCustomers("Odinson"));
console.log('printCustomers("Stark"): '+faisal.printCustomers("Stark"));
console.log('printCustomers("Rogers"): '+faisal.printCustomers("Rogers"));
console.log('printCustomers("Banner"): '+faisal.printCustomers("Banner"));

let cu6=[]
cu6.push('Chris')
cu6.push('Hawkeye')
faisal.enqueue("Barton",cu6,2);
console.log('enqueue("Barton",2)')

console.log('printPQueue(): '+faisal.printPQueue());
*/

/*
faisal.addOperator("Stark")
faisal.addOperator("Banner")
faisal.addOperator("Rogers")
faisal.addOperator("Romanoff")
faisal.addOperator("Odinson")
console.log('printPQueue(): '+faisal.printPQueue());

faisal.assignCustomer("faisal")
faisal.assignCustomer("akhtar")
console.log('printPQueue(): '+faisal.printPQueue());
console.log('printCustomers("Stark"): '+faisal.printCustomers("Stark"));
console.log('printCustomers("Banner"): '+faisal.printCustomers("Banner"));

faisal.deleteCustomer("faisal")
console.log('printPQueue(): '+faisal.printPQueue());
console.log('printCustomers("Stark"): '+faisal.printCustomers("Stark"));
*/