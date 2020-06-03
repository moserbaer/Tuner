import React from 'react'
import Formfield from '../../utils/Form/formfield';
import { update, generateData, isFormValid, populateFields} from '../../utils/Form/formActions';
import {connect} from 'react-redux';
import {getSiteData, updateSiteData} from '../../../actions/site_actions'

class UpdateSiteNfo extends React.Component {

  state = {
    formError: false,
    formSuccess: false,
    formdata:{
      address:{
        element: 'input',
        value: '',
        config:{
          label:'Address',
            name: 'address_input',
            type: 'name',
            placeholder: 'Enter the site address'
        },
        validation:{
          required: true
        },
        valid: false,
        touched: false,
        validationMessage: '',
        showLabel: true
      },
      hours:{
        element: 'input',
        value: '',
        config:{
          label:'Working hours',
            name: 'hours_input',
            type: 'name',
            placeholder: 'Enter the site working hours'
        },
        validation:{
          required: true
        },
        valid: false,
        touched: false,
        validationMessage: '',
        showLabel: true
      },
      phone:{
        element: 'input',
        value: '',
        config:{
          label:'Phone number hours',
            name: 'phone_input',
            type: 'name',
            placeholder: 'Enter the phone number'
        },
        validation:{
          required: true
        },
        valid: false,
        touched: false,
        validationMessage: '',
        showLabel: true
      },
      email:{
        element: 'input',
        value: '',
        config:{
          label:'Shop email',
            name: 'email_input',
            type: 'name',
            placeholder: 'Enter your email'
        },
        validation:{
          required: true,
          email: true
        },
        valid: false,
        touched: false,
        validationMessage: '',
        showLabel: true
      }
    }
  }

  updateForm = (element) => {
      const newFormdata = update(element,this.state.formdata,'site_info');
      this.setState({
        formError: false,
        formdata: newFormdata
      })
  }

  submitForm= (event) => {
      event.preventDefault();
      let dataToSubmit = generateData(this.state.formdata,'site_info');
      let formIsValid = isFormValid(this.state.formdata,'site_info');

      if (formIsValid) {
       this.props.dispatch(updateSiteData(dataToSubmit)).then(() => {
         this.setState({
           formSuccess: true
         },() => {
           setTimeout(() => {
             this.setState({
               formSuccess: false
             })
           },2000)
         })
       })
      }else {
        this.setState({
          formError: true
        })
      }
  }

  componentDidMount(){
    this.props.dispatch(getSiteData()).then(() => {
      console.log(this.props.site.siteData[0]);
      const newFormdata = populateFields(this.state.formdata,this.props.site.siteData[0]);
      this.setState({
        formdata: newFormdata
      })
    })
  }


  render () {
    return (
      <div className="">
        <form onSubmit={(event)=> this.submitForm(event)}>
          <h1>Site info</h1>
        <Formfield
            id={'address'}
            formdata={this.state.formdata.address}
            change={(element) => this.updateForm(element)}
          />

          <Formfield
              id={'hours'}
              formdata={this.state.formdata.hours}
              change={(element) => this.updateForm(element)}
            />

            <Formfield
                id={'phone'}
                formdata={this.state.formdata.phone}
                change={(element) => this.updateForm(element)}
              />

              <Formfield
                  id={'email'}
                  formdata={this.state.formdata.email}
                  change={(element) => this.updateForm(element)}
                />

                <div className="">
                {
                  this.state.formSuccess ?
                  <div className="form_success">
                    Success
                  </div>
                  :null
                }
                  {this.state.formError ?
                    <div className="error_label">
                      Please check your data
                    </div>
                  :null}
                  <button onClick={(event)=> this.submitForm(event)}>
                      Update
                  </button>
                </div>

        </form>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    site: state.site
  }
}

export default connect(mapStateToProps)(UpdateSiteNfo);
