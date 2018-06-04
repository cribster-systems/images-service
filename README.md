# Starkiller Systems: Images service

> Images service client and back end. Designed in conjuction with other services in related repo. Designed for efficiency and posterity!

## Related Projects

  - https://github.com/starkillersystems

## Usage

> Mongo database, Redis caching layer, and Express server developed to support this service indepedently.

## Development
For this project, I scaled the database of an existing lodging app to hold 10 million records to roughly simulate a large user base (although by industry averages, this is still a small size).
My ultimate goal was to enable this app to handle at least four hundred requests per second (RPS) in production.

Stress Testing (Development)
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

Great! All looks well! I then created Docker images for my individual service, my MongoDB database, and my Redis server. I deployed to Amazon with an EC2 instance (T2 Micro). I then stress tested my service again.

Stress Testing (Production)
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
Why is production RPS so much slower than development RPS? 
This was most likely related to my use of a T2 Micro instance in EC2, which only has 1GB of RAM and a single core, rendering my node cluster implementation ineffective. T2 Micro instance is not very well suited for production (At least for a backend of this size)

So what else could I do? Turns out AWS has Elastic Load Balancers, to which I can register several EC2 instances. The load balancer would handle all incoming traffic and spread the requests amongst my registered EC2 instances.

After implementing AWS Elastic Load Balancer with 10 EC2 instances, with one instance of Redis server and one instance of MongoDB server:
Peak RPS: 329
As I expected, I saw almost a three-fold improvement, but was still a little short of my goal. I realized that a possible bottleneck could be that I only have one MongoDB instance so reads from the database could be slowing down traffic.

After implementing Elastic Load Balancer for MongoDB instances and creating 5 instances:
Peak RPS: 449
Indeed, spinning up new instances did increase RPS. The improvement was lower than I expected, however, but did allow me to reach my goal of at least 400 RPS. One big downside of this implementation that I realized was that it only works for reads from the database. If I had to implement database writes, how would I make the new info available to all the instances? For the scope of this project, I did not concern myself with database writes, but if I had to, I would have to use mongodb replication, with one master database to write to and secondary databases to copy the new changes into. 


## Requirements

- Node 9.11.1
- Express
- Mongodb
- Redis
