class QOperator {
   constructor(operator, priority) {
      this.operator=operator
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

   enqueue(operator,priority) {
      var qOperator=new QOperator(operator,priority)
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

   changePriority(flag) {
      let operator=this.dequeue()
      if(flag)
         this.enqueue(operator.operator,++(operator.priority))
      else
         this.enqueue(operator.operator,--(operator.priority))
   }

   deleteOperator(operator) {
      for (var i = 0; i < this.operators.length; i++) {
         if(this.operators[i].operator==operator) {
            this.operators.splice(i,1)
            break
         }
      }
   }

   size() {
      return this.operators.length
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

faisal.enqueue("Stark",2);
faisal.enqueue("Banner",1);
faisal.enqueue("Rogers",1);
faisal.enqueue("Romanoff",2);
faisal.enqueue("Odinson",3);
console.log('enqueue("Stark",2)\nenqueue("Banner",1)\nenqueue("Rogers",1)\nenqueue("Romanoff", 2)\nenqueue("Odinson",3)')

console.log('printPQueue(): '+faisal.printPQueue());

faisal.changePriority(true);
console.log('changePriority(true)')

console.log('printPQueue(): '+faisal.printPQueue());

console.log('dequeue(): '+faisal.dequeue().operator);

faisal.deleteOperator("Banner");
console.log('deleteOperator("Banner")');

console.log('printPQueue(): '+faisal.printPQueue());

faisal.enqueue("Barton",2);
console.log('enqueue("Barton",2)')

console.log('printPQueue(): '+faisal.printPQueue());

// CHANGE PRIORITY, DELETE, ENQUEUE
// SIZE, PRINT QUEUE
*/