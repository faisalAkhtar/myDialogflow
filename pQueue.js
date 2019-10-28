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
      if(this.isEmpty())   return 'EMPTY'
      return this.operators.shift()
   }

   size() {
      return this.operators.length
   }

   addOperator(operator) {
      this.enqueue(operator,[],0)
   }

   deleteOperator(operator) {
      var returnValue
      for (var i = 0; i < this.operators.length; i++) {
         if(this.operators[i].operator==operator) {
            returnValue=this.operators[i]
            this.operators.splice(i,1)
            break
         }
      }
      for (var i = 0; i < returnValue.customers.length; i++) {
         this.assignCustomer(returnValue.customers[i]);
      }
      return returnValue
   }

   assignCustomer(customer) {
      let operator=this.dequeue()
      operator.customers.push(customer)
      this.enqueue(operator.operator,operator.customers,++(operator.priority))
   }

   deleteCustomer(customer) {
      var Operator
      for (var i = 0; i < this.operators.length; i++) {
         for (var j = 0; j < this.operators[i].customers.length; j++) {
            if(this.operators[i].customers[j]==customer) {
               Operator=this.deleteOperator(this.operators[i].operator)
               break
            }
         }
      }
      for (var i=0;i<Operator.customers.length;i++) {
         if(Operator.customers[i]==customer) {
            Operator.customers.splice(i,1)
            break
         }
      }
      this.enqueue(Operator.operator,Operator.customers,--(Operator.priority))
   }

   printCustomers(operator) {
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