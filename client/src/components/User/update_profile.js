import React from 'react'
import UserLayout from '../../hoc/user_nav';
import UpdatePersonalNfo from './update_personalNFO'

const UpdateProfile = (props) => {
  return (
    <UserLayout>
      <h1>Profile</h1>
      <UpdatePersonalNfo/>
    </UserLayout>
  )
}

export default UpdateProfile;
