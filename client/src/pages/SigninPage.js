import axios from "axios";
import React, { Component } from "react";
import { GoogleLogin, GoogleLogout } from "react-google-login";
import { Redirect } from "react-router-dom";
import "../App.css";
import auth from "../services/auth";

const CLIENT_ID =
	"158674415075-1r58o2988bebvq9vjitmgbqtj4udralh.apps.googleusercontent.com";

export class SigninPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			redirectToReferrer: false,
			failed: false,
			email: "",
			name: "",
			userId: "",

			isLogined: false,
			accessToken: "",
			image: "",
		};
		this.login = this.login.bind(this);
		this.handleLoginFailure = this.handleLoginFailure.bind(this);
		this.logout = this.logout.bind(this);
		this.handleLogoutFailure = this.handleLogoutFailure.bind(this);

		//this.signup = this.signup.bind(this);
	}

	logout(response) {
		this.setState((state) => ({
			isLogined: false,
			accessToken: "",
		}));
	}

	login = (response) => {
		//response.preventDefault();
		let { email, name, accessToken } = this.state;
		auth
			.authenticate(email, name, accessToken)
			.then((user) => {
				this.setState({ redirectToReferrer: true });
			})
			.catch((err) => {
				this.setState({ failed: true });
			});
	};

	handleLoginFailure(response) {
		alert("Failed to log in");
	}

	handleLogoutFailure(response) {
		alert("Failed to log out");
	}

	//rerouting?
	// signup(res){
	// 	console.log("email: ", res.wt.cu);
	// 	let postData = { name: res.wt.ad, email: res.wt.cu, token: res.xc.access_token}
	// 	postdata(postData).then((result) => {
	// 		let responseJson = result;
	// 		if(responseJson.userData){
	// 			sessionStorage.setItem('userData', JSON.stringify(responseJson));
	// 			this.setState({redirectToReferrer: true}); //redirect to
	// 		}
	// 	});
	// }

	render() {
		// const responseGoogle = (response) => {
		// 	if (response.accessToken) {
		// 		this.setState((state) => ({
		// 			isLogined: true,
		// 			accessToken: response.accessToken,
		// 			name: response.profileObj.name,
		// 			email: response.profileObj.email,
		// 			image: response.profileObj.imageUrl,
		// 			userId: response.profileObj.googleId,
		// 		}));
		// 	}
		// 	console.log("response is", response);
		// 	var res = response.profileObj;
		// 	console.log("res is:", res);
		// 	this.login(response);
		// };
		// if(this.state.isLogined) return <Redirect to="/" />;

		const responseGoogle = (response) => {
			console.log("responsegoogleB response: ", response);

			if (response.accessToken) {
				this.setState((state) => ({
					isLogined: true,
					accessToken: response.accessToken,
					name: response.profileObj.name,
					email: response.profileObj.email,
					image: response.profileObj.imageUrl,
					userId: response.profileObj.googleId,
				}));
			}

			//axios takes in an object where in backend will be creating a google login POST api callcall at api url
			//(localhost 8000) and send the token id data to the backend
			axios({
				method: "POST",
				url: "http://localhost:8000/api/googlelogin",
				//data: {tokenId: response} //UNCOMMENT
				data: { code: response.code }, //send tokencode to
			})
				.then((response) => {
					//if login success will return here a message from our rest api
					console.log("google login success", response);
					console.log(JSON.stringify(response));
					//userdata called from postdata.js to reoute to home
					sessionStorage.setItem("userData", JSON.stringify(response));
					this.setState({ redirectToReferrer: true }); //redirect to
				})
				.catch((err) => {
					console.log("ERROR OCCURED : ", err);
				});

			//this.signup(response);

			//this.login(response);
		};

		//redirect
		if (this.state.redirectToReferrer) {
			return <Redirect to={"/home"} />;
		}

		return (
			<div className="App centered">
				<div className="row"> </div>
				<div className="row">
					<div style={{ paddingTop: "20px" }} className="loginForm col-sm-12">
						<div>
							{" "}
							<h1 className="logo">Hound</h1>
							<p>Online Shipment Tracker</p>
							<div className="txt col-sm-12">
								Login With Google to Begin
							</div>{" "}
							{this.state.isLogined ? (
								<GoogleLogout
									clientId={CLIENT_ID}
									className="LoginButton"
									buttonText="Logout"
									onLogoutSuccess={this.logout}
									onFailure={this.handleLogoutFailure}
								></GoogleLogout>
							) : (
								<GoogleLogin
									clientId={CLIENT_ID}
									buttonText="Login with Google"
									className="LoginButton"
									onSuccess={responseGoogle}
									onFailure={this.handleLoginFailure}
									cookiePolicy={"single_host_origin"}
									responseType="code,token"
									to="/home"
									// responseType="code"
									// scope = "https://www.googleapis.com/auth/gmail.readonly"
								/>
							)}
							{/* {this.state.isLogined ? (
								<GoogleLogout
									clientId={CLIENT_ID}
									className="LoginButton"
									buttonText="Logout"
									onLogoutSuccess={this.logout}
									onFailure={this.handleLogoutFailure}
								></GoogleLogout>
							) : (
								<GoogleLogin
									className="LoginButton"
									clientId={CLIENT_ID}
									buttonText="Login with Google"
									onSuccess={responseGoogle}
									onFailure={this.handleLoginFailure}
									cookiePolicy={"single_host_origin"}
									responseType="code,token"
								></GoogleLogin>
							)} */}
						</div>
						<br />
						{this.state.isLogined ? (
							<h5>
								Welcome {this.state.name}!
								<br />
								<img src={this.state.image} alt="profile picture" />
								<br />
								Email: {this.state.email}
							</h5>
						) : null}
					</div>
				</div>

				<h2>Login with google</h2>
				{this.state.isLogined ? (
					<GoogleLogout
						clientId={CLIENT_ID}
						className="LoginButton"
						buttonText="Logout"
						onLogoutSuccess={this.logout}
						onFailure={this.handleLogoutFailure}
					></GoogleLogout>
				) : (
					<GoogleLogin
						clientId={CLIENT_ID}
						buttonText="Login with Google"
						onSuccess={responseGoogle}
						onFailure={this.handleLoginFailure}
						cookiePolicy={"single_host_origin"}
						//responseType="code,token"

						responseType="code"
						scope="https://www.googleapis.com/auth/gmail.readonly"
					/>
				)}
			</div>
		);
	}
}
export default SigninPage;
