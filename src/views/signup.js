import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { signup } from "../helpers/auth";
//import '../styles/chat.css'

 class SignUp extends Component {

  constructor() {
    super();
    this.state = {
      error: null,
      email: '',
      password: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  async handleSubmit(event) {
    event.preventDefault();
    this.setState({ error: '' });
    try {
      await signup(this.state.email, this.state.password);
    } catch (error) {
      this.setState({ error: error.message });
    }
  }

 

  render() {
    return (
      <div className="chat__container">
        {/* <form onSubmit={this.handleSubmit}>
          <h1>
            Sign Up to
          <Link className="title ml-2" to="/">Chat App</Link>
          </h1>
          <p className="lead">Fill in the form below to create an account.</p>
          <div className="form-group">
            <input className="form-control" placeholder="Email" name="email" type="email" onChange={this.handleChange} value={this.state.email}></input>
          </div>
          <div className="form-group">
            <input className="form-control" placeholder="Password" name="password" onChange={this.handleChange} value={this.state.password} type="password"></input>
          </div>
          <div className="form-group">
            {this.state.error ? <p className="text-danger">{this.state.error}</p> : null}
            <button className="btn btn-primary px-5" type="submit">Sign up</button>
          </div>
          <p>Already have an account? <Link to="/login">Login</Link></p>
        </form> */}


        <section>
          <span></span>
            {/* <form>
              <input placeholder='User Name' type='text'/>
              <input placeholder='Password' type='password'/>
            </form> */}
             <form onSubmit={this.handleSubmit}>
          <h1>
            Sign Up to
          <Link className="title ml-2" to="/"> Chat App</Link>
          </h1>
          <p className="lead">Fill in the form below to create an account.</p>
          <div className="form-group">
            <input className="form-control" placeholder="Email" name="email" type="email" onChange={this.handleChange} value={this.state.email}></input>
          </div>
          <div className="form-group">
            <input className="form-control" placeholder="Password" name="password" onChange={this.handleChange} value={this.state.password} type="password"></input>
          </div>
          <div className="form-group">
            {this.state.error ? <p className="text-danger">{this.state.error}</p> : null}
            <button className="btn btn-primary px-5" type="submit">Sign up</button>
          </div>
          <p>Already have an account? <Link to="/login">Login</Link></p>
        </form>
            
            {/* <h2>
              <a href='#'>Forgot Password?</a>
            </h2> */}
          </section>
      </div>
    )
  }
}

export default SignUp