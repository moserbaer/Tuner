import React from 'react'
import Card from './card.js'
const CardBlock = (props) => {

  const renderCards = () => (
    props.list ?
      props.list.map((card,i) => (
        <Card
          key={i}
          {...card}
          />
      ))
    :null
  )
  return (
    <div className="card_block">
      <div className="conatiner">
        {
          props.title ?
            <div className="title">
              {props.title}
            </div>
          :null
        }
        <div style={{
            display: 'flex',
            flexwrap: 'wrap'
          }}>
          {
            renderCards(props.list)
          }
        </div>
      </div>

    </div>
  )
}

export default CardBlock;
