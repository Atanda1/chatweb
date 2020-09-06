import React, { Component } from 'react'
import {dbf, auth} from '../services/firebase'
export class Messages extends Component {
    
    constructor(props) {
        super(props)
    
        this.state = {
             user : auth().currentUser,
             message : [],
             readError: ''
        }
    }

        async componentDidMount() {
            
            try {
                dbf.collection("inbox").where("receiver", "==", this.state.user.email)
                .get()
                .then(querySnapshot=> {
                    const message = []
                    querySnapshot.forEach(doc => {
                        // doc.data() is never undefined for query doc snapshots
                        console.log(doc.id, " => ", doc.data());
                        message.push(doc.data())
                        this.setState({ message })
                    });})

                    
            } catch (error) {
              this.setState({ readError: error.message });
            }
          }
  
    render() {
        return (
            <div>
                <div>
                {this.state.message.map(messi => {
                  return ( 
                  <div  key={messi.message}>
                    <h3>Sender: {messi.sender}</h3>
                    <p>
                    <h4>Message: {messi.message}</h4>
                    </p>       
                   </div> )
                })} 
                    
                </div>
               
            </div>
        )
    }
}

export default Messages
