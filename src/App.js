 import React from 'react';
import logo from './logo.svg';
import './App.css';
import ListItem from './ListItem'
import axios from 'axios'

class App extends React.Component {

  constructor(){
    super()
    this.state =  {
      editing: false,
      editingIndex: null,
      newTodo: '',
      todos: [],
      notification: null,
      changecl: null,
    }

    this.apiUrl = 'https://5d29bc04f3e254001472435b.mockapi.io'

    this.handleChange = this.handleChange.bind(this)
    this.addTodo = this.addTodo.bind(this)
    this.deleteTodo = this.deleteTodo.bind(this)
    this.updateTodo = this.updateTodo.bind(this)
    this.editTodo = this.editTodo.bind(this)
    //  
    this.alert= this.alert.bind(this)
  }
  
  async componentDidMount(){
    const response = await axios.get(`${this.apiUrl}/Todos`)
    // console.log(response)
    this.setState({
      todos: response.data
    })
  }
  
  handleChange(e){
    this.setState({
      newTodo: e.target.value
    })
  }

  generateTodoId(){
    const lastTodo = this.state.todos[this.state.todos.length - 1]
    if(lastTodo){
      return lastTodo.id + 1;
    }
    return 1;
  }

  async addTodo(){
    // const newTodo = {
    //   name: this.state.newTodo,
    //   id : this.generateTodoId()
    // }
    const response = await axios.post(`${this.apiUrl}/Todos` , {
      name : this.state.newTodo
    })

    const todos = this.state.todos;
    todos.push(response.data)

    this.setState({
      todos,
      newTodo: ''
    })

    this.alert('Todo was added succesffuly')
    this.setState({
      changecl: 'alert-primary'
    })
  }

   async deleteTodo(index){
    const todos = this.state.todos;
    const todo = todos[index];

    await axios.delete(`${this.apiUrl}/Todos/${todo.id}` )

    delete todos[index]

    this.setState({
      todos
    })
    this.alert('Todo was deleted succesffuly')
    this.setState({
      changecl: 'alert-danger'
    })
  }

  editTodo(index){
    const todo = this.state.todos[index]
    this.setState({
      editing: true,
      newTodo : todo.name,
      editingIndex: index
    })
  }

  alert(notification){
    this.setState({
      notification
    })

    setTimeout(() => {
        this.setState({
          notification: null
        })
    } , 2000)
  }

  async updateTodo(){
    const todo = this.state.todos[this.state.editingIndex]

    const response = await axios.put(`${this.apiUrl}/Todos/${todo.id}` , {
      name: this.state.newTodo
    })
    // todo.name = this.state.newTodo
    
    const todos = this.state.todos
    todos[this.state.editingIndex] = response.data;
    this.setState({
      todos , editing: false , editingIndex: null , newTodo: ''
    })
    this.alert('Todo was updated succesffuly')
    this.setState({
      changecl: 'alert-info'
    })
  }

  render(){
    return (
      <div className="App">
        
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
        CRUD REACT
        </p>
      </header>
      
      <div className="container">
        { this.state.notification && <div className={`alert mt-3 ${this.state.changecl}`}>
          <div className="text-centre">
                { this.state.notification}
          </div>
        </div>
        }
        <input
          name="todo"
          type="text" 
          className="my-4 form-control"
          placeholder="Add New Todo"
          onChange={this.handleChange}
          value={this.state.newTodo}
          />
          <button 
            onClick={this.state.editing ? this.updateTodo : this.addTodo} 
            className="btn-success mb-3 form-control"
            disabled={this.state.newTodo.length < 5}
            >
              { this.state.editing ? 'Update Todo' : 'Add Todo' }
          </button>
          <h2 className="text-centre p-4">
                Todos
          </h2>
        <ul className="list-group">
          {!this.state.editing && this.state.todos.map((item,index) => {
            return <ListItem
            key={item.id}
            item={item} 
            editTodo={()=>  {this.editTodo(index)}}
            deleteTodo={()=>  {this.deleteTodo(index)}}
            />
          }).reverse()}
        </ul>
      </div>
    </div>
  );
}
}

export default App;
