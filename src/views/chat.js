import React, { Component } from "react";
import { auth } from "../services/firebase";
import { db, storage, dbf } from "../services/firebase"
import '../styles/chat.css'
import {logout} from '../helpers/auth'
import { Link } from "react-router-dom";
// import ContactList from '../component/contactList'

class Chat extends Component {

    constructor(props) {
        super(props);
        this.state = {
          user: auth().currentUser,
          chats: [],
          sentChat: [],
          users: [],
          content: '',
          receiver: 'anu@gmail.com',
          readError: null,
          writeError: null,
          selectedFile: null
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.theRef = React.createRef();
      }
      // async componentDidMount() {
      //   this.setState({ readError: null });
      //   try {
      //     db.ref('chats').orderByChild("email").equalTo(this.state.receiver).on("value", snapshot => {
      //       let chats = [];
      //       snapshot.forEach((snap) => {
      //         chats.push(snap.val());
      //       });
      //       this.setState({ chats });
      //     });
      //   } catch (error) {
      //     this.setState({ readError: error.message });
      //     console.log(error.message)
      //   }
      // }

      async componentDidMount() {
        this.setState({ readError: null });
        
        try {
          dbf.collection("inbox").where("receiver", "==", this.state.user.email).where("sender", "==", this.state.receiver)
          .onSnapshot(querySnapshot=> {
              const chats = []
              querySnapshot.forEach(doc => {
                  // doc.data() is never undefined for query doc snapshots
                  console.log(doc.id, " => ", doc.data());
                  chats.push(doc.data())

                  this.setState({ chats })
              });})
      } catch (error) {
        this.setState({ readError: error.message });
      }

     
        try {
          dbf.collection("inbox").where("sender", "==", this.state.user.email).where("receiver", "==", this.state.receiver)
      .onSnapshot(querySnapshot=> {
          let sentChat = []
          querySnapshot.forEach(doc => {
              // doc.data() is never undefined for query doc snapshots
              console.log(doc.id, " => ", doc.data());
              sentChat.push(doc.data())
              this.setState({ sentChat })
          });}) 

        } catch (error) {
          this.setState({ readError: error.message });
        }
      }

      

     async componentDidUpdate (prevProps, prevState) {
        if(prevState.receiver !== this.state.receiver) {
          this.setState({ chats : [] });
       
          try {
            dbf.collection("inbox").where("receiver", "==", this.state.user.email).where("sender", "==", this.state.receiver)
            .onSnapshot(querySnapshot=> {
                const chats = []
                querySnapshot.forEach(doc => {
                    // doc.data() is never undefined for query doc snapshots
                    console.log(doc.id, " => ", doc.data());
                    chats.push(doc.data())
                    this.setState({ chats })
                });})
        } catch (error) {
          this.setState({ readError: error.message });
        }

        this.setState({ sentChat: [] });
          try {
            dbf.collection("inbox").where("sender", "==", this.state.user.email).where("receiver", "==", this.state.receiver)
        .onSnapshot(querySnapshot=> {
            let sentChat = []
            querySnapshot.forEach(doc => {
                // doc.data() is never undefined for query doc snapshots
                console.log(doc.id, " => ", doc.data());
                sentChat.push(doc.data())
                this.setState({ sentChat })
            });}) 

          } catch (error) {
            this.setState({ readError: error.message });
          }
        }
      }
      handleChange(event) {
        this.setState({
          content: event.target.value
        });
      }
      switchChat = e =>{
        this.setState({
          receiver: this.theRef.current.value
        });
      }
      fileChangedHandler = event => {
        this.setState({ selectedFile: event.target.files[0] })
      }

      
      logout (e) {
        logout(e)
      }
      handleSubmit(event) {
        event.preventDefault();
        const file = this.state.selectedFile;
        this.setState({ writeError: null });
        if( file === null ) {
          dbf.collection("inbox").add({
                   message: this.state.content,
                   sender: this.state.user.email,
                   receiver: this.state.receiver,
                   timestamp: Date.now(),
                   uid: this.state.user.uid
                 }).then(() => {
                  this.setState({ content: '' });
                 }).catch(err => {
                  this.setState({ writeError: err.message });
                 }); 
        } else {
          const name = +new Date() + "-" + file.name;
        //
        const metadata = {
          contentType: file.type
        };
        const task = storage.child(name).put(file, metadata);
        task
          .then(snapshot => snapshot.ref.getDownloadURL())
          .then(url => {
            console.log(url);
         //  const url = url;
           dbf.collection("inbox").add({
              message: this.state.content,
              sender: this.state.user.email,
              receiver: this.state.receiver,
              timestamp: Date.now(),
              uid: this.state.user.uid,
              image: url
        })
      })
           //save picture of image
        .then(() => {
          this.setState({ content: '' });
          this.setState({ selectedFile: null });
         }).catch(err => {
          this.setState({ writeError: err.message });
         });          
        } 
       }
    
      
    formatTime(timestamp) {
      const d = new Date(timestamp);
      const time = `${d.getDate()}/${(d.getMonth()+1)}/${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}`;
      return time;
    }
    render() {
        return (
            <div className="chat__container">
              <div className="contact__list">
                <h3>Contacts</h3>
                {/* <div>          
                  {this.state.users.map(user => <div className="contact__mail"><h4 onClick={this.selectContact} id={user.email} key={user.email} value={user.email}>{user.email}</h4></div>)}        
              </div> */}
                {/* <select name="fruit" multiple onChange={this.switchChat} value={this.state.value}>
                {this.state.users.map(user => <option key={user.email} value={user.email}>{user.email}</option>)}
                </select> */}
                <input className="chat__input" ref={this.theRef} />
                <button className="chat__button" onClick={this.switchChat}>Chat</button>
                <div className="name"><h3>{this.state.receiver}</h3></div>
              </div>
              <div className="messages">
             
              <div className="chats">
                {this.state.chats.map(chat => {
                  return ( 
                  <div className="indi__message" key={chat.timestamp}>
                    <div className='image__container'>{chat.image ? <img src={chat.image}/> : null}</div>
                    <p>
                      {chat.message}<h5><i>{chat.sender}</i> {this.formatTime(chat.timestamp)}</h5>
                    </p>       
                   </div> )
                })
                }
                {
                  this.state.sentChat.map(chat => {
                    return ( 
                    <div className="indi__message__sent" key={chat.timestamp}>
                      <div className='image__container'>{chat.image ? <img src={chat.image}/> : null}</div>
                      <p>
                        {chat.message}<h5><i>{chat.sender}</i> {this.formatTime(chat.timestamp)}</h5>
                      </p>       
                     </div> )
                  })
                }
              </div>
              <form onSubmit={this.handleSubmit}>
                <div className="bottom__item">
                  <div><input 
                      onChange={this.handleChange} 
                      value={this.state.content}>
                  </input>
                  {this.state.error ? 
                      <p>{this.state.writeError}</p> 
                      : null}
                  </div>
                  <div><input type="file" onChange={this.fileChangedHandler}></input></div>
                  <button className="btn__send" type="submit">Send</button>
                </div>
              </form>
              <div>
                Signed in as: <strong>{this.state.user.email}</strong><br/>
                <Link to="/inbox">
                  Check your inbox
                </Link>
                <button onClick={logout}>LogOut</button>
              </div>
              </div>
              </div>
          
          );
    }
}

export default Chat
