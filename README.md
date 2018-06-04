# Starkiller Systems: Images service

> Images service client and back end. Designed in conjuction with other services in related repo. Designed for efficiency and posterity!

## Related Projects

  - https://github.com/starkillersystems

## Usage

> Mongo database, Redis caching layer, and Express server developed to support this service indepedently.

## Development

Stress Testing (Service, Development)
Used 2 stress-testing tools: Artillery & Siege
Config for each tool:

Siege: 
```
siege()
 .on(3000)
 .for(100000).times
 .get('/reviews/15000?index=1')
 .attack();
```


Artillery:
```
config:
 target: "http://localhost:3000/reviews"
 phases:
   - duration: 20
     arrivalRate: 20
scenarios:
 - name: "Browsing"
   flow:
   - loop:
     - get:
         url: "/{{ $loopCount }}?index=1"
         count: 5
```

Peak RPS before any server optimization:
Artillery: 1,264
Siege: 1,213

Peak RPS after implementing Node cluster:
Artillery: 1,910
Siege: 2,100


Stress Testing (Service, Production)
Tool used: Artillery 

Config: 
```
config:
 target: "http://ec2-54-82-237-60.compute-1.amazonaws.com/reviews"
 phases:
   - duration: 20
     arrivalRate: 20
scenarios:
 - name: "Browsing"
   flow:
   - loop:
     - get:
         url: "/{{ $loopCount }}?index=1"
         count: 5
```

Peak RPS: 115
Why is production RPS so much slower than dev? 
Most likely related to my use of a T2 Micro instance in EC2, which only has 1GB of RAM and a single core, rendering my node cluster implementation ineffective
Conclusion: T2 Micro instance is not very well suited for production (At least for a backend of this size)


Implemented AWS Elastic Load Balancer with 10 EC2 instances, with one instance of Redis server and one instance of MongoDB server:
Peak RPS: 329
Better results, but not quite what I’d like
Possible bottleneck could be that I only have one MongoDB instance so reads from the database could be slowing down traffic

Implemented Elastic Load Balancer for MongoDB instances and creating 5 instances:
Peak RPS: 513
Indeed, spinning up new instances did increase RPS 
However, downside of this implementation is that it only works for reads from the database. If I had to implement database write, how would I make the new info available to all the instances? 


## Requirements

- Node 9.11.1
- Express
- Mongodb
- Redis
