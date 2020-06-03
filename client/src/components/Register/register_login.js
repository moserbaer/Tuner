import React from 'react';
import MyButton from '../utils/button.js';
import Login from './login';

const RegisterLogin = () => {
  return (
    <div className="page_wrapper">
        <div className="container">
          <div className="register_login_container">
            <div className="left">
              <h1>New Customers</h1>
              <p>
                quis amet quem nulla sunt enim aute veniam esse quem legam legam tamen labore
                illum fugiat aliqua sunt aute fore nisi exportss anim anim cillum fugiat tamen
                enim sunt anim velit eram anim dolor dolore quae dolore quis quorum magna
              </p>
              {/*user define button and passing props*/}
              <MyButton
                type="default"
                title="Create an account"
                linkTo="/register"
                addStyles={{
                    margin: '10px 0 0 0'
                }}
                />
            </div>
            <div className="right">
                <h2>Registered customers</h2>
                <p>If you have an account please LOGIN</p>
                <Login />
            </div>
          </div>
        </div>

    </div>
  )
}

export default RegisterLogin;
