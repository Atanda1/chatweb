import React, { Component } from 'react'
import {db} from '../services/firebase'
import '../styles/inbox.css'

export class ContactList extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
             users : []
        }
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
    render() {
        return (
          <div>          
            {this.state.users.map(user => <div className="contact__mail"><h4 key={user.email} value={user.email}>{user.email}</h4></div>)}        
          </div>
        )
    }
}

export default ContactList
