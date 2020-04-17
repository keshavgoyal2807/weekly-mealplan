import React from 'react';
import '../App.css';
import {connect} from 'react-redux'
import { addRecipe, removeFromCalendar } from '../actions';
import capitalize from '../utils/helper'
import {FaRegCalendarAlt} from 'react-icons/fa'
import {FaArrowRight} from 'react-icons/fa'
import {FaRegWindowClose} from 'react-icons/fa'
import Modal from 'react-modal'
import ReactLoading from 'react-loading'
import { fetchRecipes } from '../utils/api';
import FoodList from './foodList';
import ShoppingList from './shoppingList';

class App extends React.Component{
  constructor(props){
    super(props);
    this.state={
      openModal : false,
      day:null,
      meal:null,
      searchValue:'',
      loadingFood:false,
      food:null,
      loadList:false
    }
  }

  openFoodModal = ({day,meal})=>{
    this.setState({
      openModal:true,
      day,
      meal
    })
  }
  closeFoodModal = ()=>{
    this.setState({
      openModal:false,
      day:null,
      meal:null,
      food:null,
      searchValue:''
    })
  }
  closeIngModal = ()=>{
    this.setState({
      loadList:false
    })
  }
  searchFood = (e)=>{
    if(!this.state.searchValue)
    {
      return;
    }
    e.preventDefault();
    this.setState({
      loadingFood:true
    })
      fetchRecipes(this.state.searchValue).then((food)=>{
        // console.log(food)
        this.setState({
          food,
          loadingFood:false
        })
      })
  }
  changeSearchValue = (e)=>{
    this.setState({
      searchValue:e.target.value
    })
  }
  generateSL = ()=>{
    this.setState({
      loadList:true
    })
  }
  generateShoppingList = () => {
    return this.props.calendar.reduce((result, { meals }) => {
      const { breakfast, lunch, dinner } = meals

      breakfast && result.push(breakfast)
      lunch && result.push(lunch)
      dinner && result.push(dinner)

      return result
    }, [])
    .reduce((ings, { ingredientLines }) => ings.concat(ingredientLines), [])
  }
  render()
  {
    const mealTypes = ['breakfast','lunch','dinner'];
    return (
      <div className="calendar">
        <div className="header">
          <h3>Weekely Meal Plan</h3>
          <p onClick={this.generateSL}>Shopping List</p>
        </div>
        <ul className="meal-types">
          {mealTypes.map((mealType)=>{
            return(<li key={mealType} className="meal-type">{capitalize(mealType)}</li>)
          })}
        </ul>
        <div className="calendar-details">
          <div className="days">
            {this.props.calendar.map((detail)=>{
              return(<h3 className="week-day">{capitalize(detail.day)}</h3>)
            })}
          </div>
          <div className="food-grid">
              {this.props.calendar.map(({day,meals})=>{
                return(
                <ul className="meals">
                  {mealTypes.map((meal)=>{
                    console.log(meals[meal])
                    return(
                      <li className="meals-details">
                        {meals[meal] ? <div className="food-item">
                            <img src={meals[meal].image} alt={meals[meal].label} />
                            <button onClick={(()=>{this.props.removeRecipe({day,meal})})}>Clear</button>
                            </div> : <button className="cal-icon" onClick={()=>{this.openFoodModal({day,meal})}}>
                            <FaRegCalendarAlt size={40}></FaRegCalendarAlt>
                          </button>}
                      </li>
                    )
                  })}
                </ul>
                )
              })}
          </div>
        </div>
        <Modal 
          className='modal'
          overlayClassName='overlay'
          isOpen={this.state.openModal}
          onRequestClose={this.closemodal}
          contentLabel='Modal'
          >
            {this.state.loadingFood ? <ReactLoading type="bars" color="#000" className='loader'/> :
            <div className="search-bar">
            <h3>Find a Meal for {this.state.day} {this.state.meal}</h3>
            <div className="search">
            <input type="text" placeholder="search-recipes" className="search-recipe" value={this.state.searchValue} onChange={this.changeSearchValue}/>
            <button onClick={this.searchFood} className="right-button"><FaArrowRight size={30} /></button>
            </div>
            <button onClick={this.closeFoodModal} className="closewindow"><FaRegWindowClose size={30} /></button>
            {this.state.food && (<FoodList food={this.state.food} onSelect={(recipe)=>{
                this.props.selectRecipe({recipe,day:this.state.day,meal:this.state.meal})
                this.closeFoodModal()
            }}/>)}
            </div>
            }
          </Modal>
          <Modal
            className="modal"
            overlayClassName='overlay'
            isOpen={this.state.loadList}
            onRequestClose={this.closeListModal}
            contentLabel='Modal'
            >
              {this.state.loadList && (<div className="ing">
              <ShoppingList list={this.generateShoppingList()} />
              <button onClick={this.closeIngModal} className="closewindow"><FaRegWindowClose size={30} /></button>
              </div>)}
          </Modal>
      </div>
    );
  }
}
const mapStateToProps =({calendar,food})=>{
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
return({
  calendar: days.map((day)=>{
    return({
      day,
      meals: Object.keys(calendar[day]).reduce((meals,meal)=>{
        meals[meal] = calendar[day][meal] ? food[calendar[day][meal]] : null
        return meals
      },{})
    })
  }),
})
}

const mapDispatchToProps = (dispatch)=>{
  return({
    selectRecipe: (data)=>{dispatch(addRecipe(data))},
    removeRecipe: (data)=>{dispatch(removeFromCalendar(data))}
  })
}

export default connect(mapStateToProps,mapDispatchToProps)(App);
