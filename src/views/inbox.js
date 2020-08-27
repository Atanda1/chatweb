import React, { Component } from 'react'
import '../styles/inbox.css'
import { auth } from "../services/firebase";
import { db, dbf } from "../services/firebase"
import Message from '../component/messages'
import {Link} from 'react-router-dom'
export class Inbox extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
          user: auth().currentUser,
            users : [],
            value : '',
            message : ''  
        }
        this.handleMessage = this.handleMessage.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.change = this.change.bind(this);
    }

    async componentDidMount() {
        try {
          db.ref("users").on("value", snapshot => {
            let users = [];
            snapshot.forEach((snap) => {
              users.push(snap.val());
            });
            this.setState({ users });
          });
        } catch (error) {
          console.log(error.message)
        }
    }

    handleMessage (e) {
      this.setState({
        message: e.target.value
      });
    }

    sendMessage (e) {
      dbf.collection("inbox").add({
        message: this.state.message,
        sender: this.state.user.email,
        receiver: this.state.value
      }).then(() => {
       this.setState({ message: '' });
       alert("Mesage sent")
      }).catch(err => {
       console.log(err.message)
      }); 
    }


    change(event){
        this.setState({
          value: event.target.value
        });
    }

    render() {
        return (
            <div className="inbox__container">
                <h1>Here's your inbox</h1>
                <Message/>
                <h1>Compose a message</h1>
                <select id="lang" onChange={this.change} value={this.state.value}>
                  <option value="select">Select</option>
                  {this.state.users.map(user => <option key={user.email} value={user.email}>{user.email}</option>)}
               </select>
               <textarea 
                className ="ma"
                type="text" 
                name=""
                onChange={this.handleMessage} 
                value={this.state.message}
               />
               <button 
               onClick={this.sendMessage}
               className ="ma"
               >
                 Send
               </button>
               <Link to="/chat">Back to group chat</Link>
            </div>
        )
    }
}

export default Inbox


