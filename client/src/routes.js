import React from 'react';
import {Switch, Route} from 'react-router-dom';
import Layout from './hoc/layout';
import Auth from './hoc/auth';
import Home from './components/Home/home.js';
import RegisterLogin from './components/Register/register_login.js';
import Register from './components/Register/register';
import UserDashboard from './components/User/user';
import Shop from './components/Shop/shop.js';
import AddProduct from './components/User/Admin/add_products'
import ProductPage from './components/Product/Product.js'
import UserCart from './components/User/Cart.js'
import ManageCategories from './components/User/Admin/manage_categories';
import UpdateProfile from './components/User/update_profile';
import ManageSite from './components/User/Admin/manage_site.js'


const Routes = () =>{
  return(
    <Layout>
      <Switch>
          <Route path="/user/dashboard" exact component={Auth(UserDashboard, true)}/>
          <Route path="/user/cart" exact component={Auth(UserCart, true)}/>
          <Route path="/admin/add_product" exact component={Auth(AddProduct, true)}/>
          <Route path="/admin/manage_categories" exact component={Auth(ManageCategories, true)}/>
          <Route path="/user/user_profile" exact component={Auth(UpdateProfile, true)}/>
          <Route path="/admin/site_info" exact component={Auth(ManageSite, true)}/>

          <Route path="/product_detail/:id" exact component={Auth(ProductPage, null)}/>
          <Route path="/register_login" exact component={Auth(RegisterLogin, false)}/>
          <Route path="/register" exact component={Auth(Register,false)}/>
          <Route path="/shop" exact component={Auth(Shop,null)}/>
          <Route path="/" exact component={Auth(Home,null)}/>
      </Switch>
    </Layout>

  )
}

export default Routes;
