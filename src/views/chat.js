import React, { Component } from "react";
import { auth } from "../services/firebase";
import { db, storage } from "../services/firebase"
import '../styles/chat.css'
import {logout} from '../helpers/auth'
import { Link } from "react-router-dom";
import ContactList from '../component/contactList'

class Chat extends Component {

    constructor(props) {
        super(props);
        this.state = {
          user: auth().currentUser,
          chats: [],
          content: '',
          readError: null,
          writeError: null,
          selectedFile: null
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
      }
      async componentDidMount() {
        this.setState({ readError: null });
        try {
          db.ref("chats").on("value", snapshot => {
            let chats = [];
            snapshot.forEach((snap) => {
              chats.push(snap.val());
            });
            this.setState({ chats });
          });
        } catch (error) {
          this.setState({ readError: error.message });
        }
      }

      handleChange(event) {
        this.setState({
          content: event.target.value
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
          db.ref("chats").push({
                   content: this.state.content,
                   email: this.state.user.email,
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
           const image = url;
           db.ref("chats").push({
            content: this.state.content,
            email: this.state.user.email,
            timestamp: Date.now(),
            uid: this.state.user.uid,
            image: image
           // posterId: localStorage.getItem('uid')
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
        return this.state.chats.length < 1 ? (<div>Your messages are loading</div>) :(
            <div className="chat__container">
              <div className="contact__list">
                <h3>Contacts</h3>
                <ContactList/>
              </div>
              <div className="messages">
              <div className="chats">
                {this.state.chats.map(chat => {
                  return ( 
                  <div className="indi__message" key={chat.timestamp}>
                    <div className='image__container'>{chat.image ? <img src={chat.image}/> : null}</div>
                    <p>
                      {chat.content}<h5><i>{chat.email}</i> {this.formatTime(chat.timestamp)}</h5>
                    </p>       
                   </div> )
                })}
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
