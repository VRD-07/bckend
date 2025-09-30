const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://VRD:${password}@cluster0.kht5qfu.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: Number,
})

const Person = mongoose.model('person', personSchema)

if(process.argv.length === 3){
    Person.find({}).then(result => {
        console.log('phonebook: ');
        result.forEach(p => {
            console.log(p.name,p.number);
        });
        mongoose.connection.close();
    })
}
else{
    const name = process.argv[3]
    const number = process.argv[4];

    const person = new Person({name , number})

    person.save().then(()=>{
      console.log(`added ${name} : ${number} to phonebook`)
      mongoose.connection.close();
    })
}