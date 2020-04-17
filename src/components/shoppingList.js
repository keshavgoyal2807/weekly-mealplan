import React from 'react'

class ShoppingList extends React.Component{
    render()
    {
        console.log(this.props.list)
        return(
            <div className='ingredients-list'>
                <h3 className='subheader'>
                    Your Shopping List
                </h3>
                <ul>
                    {this.props.list.map((item) => (
                    <li key={item}>
                        {item}
                    </li>
                    ))}
                </ul>
            </div>
        )
    }
}

export default ShoppingList