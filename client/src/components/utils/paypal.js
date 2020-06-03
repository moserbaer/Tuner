import React from 'react'
import PaypalExpressBtn from 'react-paypal-express-checkout';

class Paypal extends React.Component {

  render () {

    const onSuccess = (payment) => {
      //console.log(JSON.stringify(payment));
      this.props.onSuccess(payment);
    }

    const onCancel = (data) => {
      console.log(JSON.stringify(data));
    }

    const onError = (err) => {
      console.log(JSON.stringify(err));
    }

    let env = 'sandbox';
    let currency = 'INR';
    let total = this.props.toPay;

    const client = {
      sandbox:'AagLMzpTMiX2Jzouf3z7YwAAh5XfvxaPqjHY5X-wM9oPMvlNjwvz17FzGImDfVpJ0svaRJLrRs4-S9-x',
      production:''
    }

    return (
      <div>
        <PaypalExpressBtn
          env={env}
          client={client}
          currency={currency}
          total={total}
          onError={onError}
          onSuccess={onSuccess}
          onCancel={onCancel}
          style={{
            size:'large',
            color:'blue',
            shape:'rect',
            label:'checkout'
          }}
          />
      </div>
    )
  }
}

export default Paypal;
