import React from 'react'
import Formfield from '../utils/Form/formfield';
import { update, generateData, isFormValid} from '../utils/Form/formActions'
import { withRouter} from 'react-router-dom';//for direct connection to router
import {loginUser} from '../../actions/user_actions';
import {connect} from 'react-redux';


class Login extends React.Component {

  state =  {
    formError: false,
    formSuccess:'',
    formdata:{
      email:{
        element: 'input',
        value: '',
        config:{
            name: 'email_input',
            type: 'email',
            placeholder: 'Enter your email'
        },
        validation:{
          required: true,
          email: true
        },
        valid: false,
        touched: false,
        validationMessage: ''
      },
      password:{
        element: 'input',
        value: '',
        config:{
            name: 'password_input',
            type: 'password',
            placeholder: 'Enter your password'
        },
        validation:{
          required: true
        },
        valid: false,
        touched: false,
        validationMessage: ''
      }
    }
  }

  updateForm = (element) => {
      const newFormdata = update(element,this.state.formdata,'login');
      this.setState({
        formError: false,
        formdata: newFormdata
      })
  }


  submitForm= (event) => {
      event.preventDefault();
      let dataToSubmit = generateData(this.state.formdata,'login');
      let formIsValid = isFormValid(this.state.formdata,'login');

      if (formIsValid) {
        this.props.dispatch(loginUser(dataToSubmit)).then(response =>{
          if (response.payload.loginSuccess) {
            console.log(response.payload);
            this.props.history.push('/user/dashboard');
          }else {
            this.setState({
              formError: true
            })
          }
        });
      }else {
        this.setState({
          formError: true
        })
      }


  }


  render () {
    return(
      <div className="signin_wrapper">
      <form onSubmit={(event) => this.submitForm(event)}>
          <Formfield
              id={'email'}
              formdata={this.state.formdata.email}
              change={(element) => this.updateForm(element)}
            />
            <Formfield
                id={'password'}
                formdata={this.state.formdata.password}
                change={(element) => this.updateForm(element)}

              />

            {this.state.formError ?
              <div className="error_label">
                Please check your data
              </div>
            :null}
            <button onClick={(event)=> this.submitForm(event)}>
                LOGIN
            </button>
      </form>

    </div>
  );

  }
}

export default connect()(withRouter(Login));
