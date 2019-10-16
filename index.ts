const express=require('express');
import {Entity, PrimaryGeneratedColumn, Column, PrimaryColumn, createConnection, ConnectionManager, Connection, getConnection} from "typeorm";
import mysql from 'mysql';
import "reflect-metadata";
const app=express();
 const port=4000;
 
 app.use(express.json());
 
 app.use(express.urlencoded({ extended: false }));


 @Entity()
 class NewMember{
  @PrimaryColumn()
     id:number;
     @Column()
     name:string;
     @Column()
     phone:number;
     @Column()
     committe:string;
     constructor(id:number,name:string,phone:number,committe:string){
         this.id=id;
         this.name=name;
         this.phone=phone;
         this.committe=committe;
     }
 }




 createConnection({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password:"password",
  database:'test',
  entities: [
     NewMember
  ],
synchronize: true,
}).then(async connection => {
const member1=new NewMember(1,'ahmed',123456,'hr');
const member2=new NewMember(2,'ahmed',12356,'fr');
const member3=new NewMember(3,'ahmedasdas',56,'tech');


const members:NewMember[]=[member1,member2,member3];

 app.get('/members', async (req:any,res:any)=>{
     res.json(members);
     await connection.manager.save(members).then(members=>{
      console.log(members);
    }
    )
 

 })

 app.get('/members/:id', async (req:any, res:any) => {
    const found = members.some(member => member.id === parseInt(req.params.id));
  
    if (found) {
      res.json(members.filter(member => member.id === parseInt(req.params.id)));
      await connection.manager.save(members).then(con=>{
        console.log(con);
      }
      )
  
    
   
    } else {
      res.status(400).json({ msg: `No member with the id of ${req.params.id}` });
    }
  });

  app.post('/members',  async (req:any, res:any) => {
 
    const Member =new NewMember(req.body.id,req.body.name,req.body.phone,req.body.committe);
 
    members.push(Member);
    res.json(members);
    await connection.manager.save(members).then(con=>{
      console.log(con);
    }
    )

  });



  app.put('/members/:id', (req:any, res:any) => {
    const found = members.some(member => member.id === parseInt(req.params.id));
  
    if (found) {
      const updMember = req.body;
      members.forEach(async member => {
        if (member.id === parseInt(req.params.id)) {
          member.name = updMember.name ? updMember.name : member.name;
          member.id = updMember.id ? updMember.id : member.id;
          member.phone = updMember.phone ? updMember.phone : member.phone;
          member.committe = updMember.committe ? updMember.committe : member.committe;
          res.json({ msg: 'Member updated', member });
          await connection.manager.save(members).then(con=>{
            console.log(con);
          }
          )
        }
      
      });
    } else {
      res.status(400).json({ msg: `No member with the id of ${req.params.id}` });
    }
  });

  app.delete('/member/:id', async (req:any, res:any) => {
    let i;
    const {id} = req.params;
    for(i=0; i<members.length; i++){
        if(members[i].id==id)
        break;
    }
    members.splice(i,1); 
    connection.manager.query(`DELETE FROM  test.new_member
    WHERE id = ${i}`)
    await connection.manager.save(members).then(con=>{
      console.log(con);
    }
    )
        res.send("The Member Is Removed Succecfully"); 
 
      }
  )
 
}).catch(error => console.log(error));
  app.listen(port,()=>{
      console.log(`Server Running on  ${port}`)
  })

