import React, { Component } from 'react';
import './App.css';
import Web3 from 'web3';
import 'bootstrap/dist/css/bootstrap.css';
import { Router, Route, Link, browserHistory, IndexRoute } from 'react-router';
import RegistrationForm from './registrationForm'
import RegisterHeading from './registerHeading'
var web3 = new Web3(new Web3.providers.HttpProvider("http://cilblockchain2.uksouth.cloudapp.azure.com/api"));
import {userAddr, userAbi} from './constants.js'

var walletAddr = web3.eth.accounts[0];

var userCon = web3.eth.contract(userAbi).at(userAddr);

export default class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            openRegister: false,
        }
        this.openRegisterWindow = this.openRegisterWindow.bind(this);
        this.resetloginUserID = this.resetloginUserID.bind(this);
        this.resetloginPassword = this.resetloginPassword.bind(this);
        this.submitClick = this.submitClick.bind(this);
        this.updateStateALL = this.updateStateALL.bind(this);
    }

    openRegisterWindow() {
        this.setState({ openRegister: true })
    }
    resetloginUserID() {
        this.setState({ loginidval: "" });
    }
    resetloginPassword() {
        this.setState({ loginpwdval: "" });
    }
    updateStateALL(e) {
        this.setState({ [e.target.name]: e.target.value });
    }
    submitClick(e) {
        // var WalletLoginSuccess = web3.personal.unlockAccount(web3.eth.accounts[0],this.state.loginpwdval);
        var contractLoginSuccess = userCon.getLogin(this.state.loginidval, this.state.loginpwdval);
        if (contractLoginSuccess == true) {               //&& WalletLoginSuccess == true
            alert("Login success");
        }
        else {
            alert("Login failed");
        }
    }

    render() {

        if (this.state.openRegister) {
            return (
                <div>
                    <RegisterHeading />
                    <RegistrationForm />
                </div>
            )
        }
        return (
            <div>
                <div id="header">
                    <span id="Heading-name">Home ></span>
                </div>

                <div id="Info-box" className="col-md-5">
                    >>> Proof of Concept marketplace /exchange for the trade of illiquid instruments – based on blockchain - decentralised, distributed ledger technology.<br /><br /><br />
                    >>> Undertaken by HCL in collaboration with Deutsche Bank
                    </div>

                <div id="login-body">
                    <div id="Register-box" className="col-md-5">
                        <div id="login-input-box" >
                            <form autoComplete="off">
                                <label id="user-id">User ID:</label>
                                <input id="user-id-input" className="input-box" value={this.state.loginidval} onChange={this.updateStateALL} name="loginidval" />
                                <button id="dlt-btn-userid" className="delete-button login-delete-btn" onClick={this.resetloginUserID} type="button">X</button>
                                <hr className="hr-width hr noPadding"></hr>

                                <label id="user-password">Password:</label>
                                <input id="user-password-input" type="password" value={this.state.loginpwdval} onChange={this.updateStateALL} className="input-box" name="loginpwdval" />
                                <button id="dlt-btn-userid" className="delete-button login-delete-btn" onClick={this.resetloginPassword} type="button">X</button>
                                <hr className="hr-width hr noPadding"></hr>

                                <Link to="userProfile"><button className="Button-style" id="user-login-button" type="button" onClick={this.submitClick}>login</button><br /></Link>
                                <div id="no-account-box">
                                    <span>New User?</span>
                                    <a onClick={this.openRegisterWindow}> Click here to Register</a><br />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

        );
    }

}
