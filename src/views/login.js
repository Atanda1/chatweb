import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { signin } from "../helpers/auth";
import '../styles/login.css'

class SignIn extends Component {

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
      await signin(this.state.email, this.state.password);
    } catch (error) {
      this.setState({ error: error.message });
    }
  }

 

  render() {
    return (
      <div className="chat__container">
        <section>
          <span></span>
            
            <form className="mt-5 py-5 px-5" onSubmit={this.handleSubmit}>
          <h1>
            Sign In to
          <Link className="title ml-2" to="/"> Chat App</Link>
          </h1>
          <p className="lead">Good To Have You Back</p>
          <div className="form-group">
            <input className="form-control" placeholder="Email" name="email" type="email" onChange={this.handleChange} value={this.state.email}></input>
          </div>
          <div className="form-group">
            <input className="form-control" placeholder="Password" name="password" onChange={this.handleChange} value={this.state.password} type="password"></input>
          </div>
          <div className="form-group">
            {this.state.error ? <p className="text-danger">{this.state.error}</p> : null}
            <button className="btn btn-primary px-5" type="submit">Log In</button>
          </div>
          <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
        </form>
          </section>
      </div>
    )
  }
}

export default SignIn;