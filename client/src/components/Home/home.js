import React, { Component } from 'react';
import HomeSlider from './home_slider';
import HomePromotion from './home_promotion';
import CardBlock from '../utils/card_block';
import { connect } from 'react-redux';
import { getProductsBySell, getProductsByArrival} from '../../actions/product_actions';

class Home extends Component {

  componentDidMount(){
    this.props.dispatch(getProductsBySell());
    this.props.dispatch(getProductsByArrival());
  }

  render(){
    return(
      <div>
          <HomeSlider />
          <CardBlock
              list={this.props.products.bySell}
              title="Best Selling Guitars"
            />
          <HomePromotion />
            <CardBlock
                list={this.props.products.byArrival}
                title="New Arrivals"
              />
      </div>
    )
  }
}

const mapStateToprops = (state) => {
  return {
    products: state.products
  }
}

export default connect(mapStateToprops)(Home);
