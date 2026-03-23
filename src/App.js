/*jshint esversion: 6 */
import React, {Component} from 'react';
import WeatherScreen from './components/weather-screen';
import ConfigScreen from './components/config-screen';
import TodoScreen from './components/todo-screen';
import './App.css';
import './style.css';
import './weather-icons.min.css';
import {getTasks, getTags, getForecast, getWeatherData, createTask, deleteTask, updateTask, completeTask, getTask, getConfig, saveConfig} from "./lib/data.tsx";
import {taskDueToday} from "./lib/util";
import {Config} from "./lib/config.tsx";

class App extends Component{
  constructor(props){
    super(props);    
    this.state = {
      currentScreen : 'WEATHER',
      previousScreen: '',
      weatherData : {},
      cities: [],
      countries: [],
      forecastItems: [],
      tasks: [],
      tags: [],
      currentTask: {
        id: 0,
        content: '',
        due_string: '',
        labels: []
      },
      config:{},
      dateTime: new Date(),
      dateTimeIntervalId: 0,
      weatherIntervalId: 0,
      forecastIntervalId: 0,
      currentDynamicColour: '#000'
    };
  }

  dataCallback = (data) => {
    console.log(data);
    this.setState(data);
  };

  agenda = () => {
    return this.state.tasks.filter(a => taskDueToday(a));
  };
  
  initaliseData(){
    getTasks(this.dataCallback, this.state.config.todoistApiKey);
    getTags(this.dataCallback, this.state.config.todoistApiKey);
    getWeatherData(this.dataCallback, this.state.config.selectedCity);

    setTimeout(() => {
      getForecast(this.dataCallback,this.state.config.selectedCity);
    }, 3000);

    var dateTimeIntervalId = setInterval(() => {
      this.setState({dateTime: new Date()});
      this.setDynamicColour();
    }, 1000);

    var weatherIntervalId = setInterval(() => {
      getWeatherData(this.dataCallback, this.state.config.selectedCity);
    }, 360000);

    var forecastIntervalId = setInterval(() => {
      getForecast(this.dataCallback, this.state.config.selectedCity);
    }, 5400000);

    var todoisIntervalId = setInterval(() => {
      getTags(this.dataCallback, this.state.config.todoistApiKey);
      getTasks(this.dataCallback,this.state.config.todoistApiKey);
    }, 90000);



    this.setState(
      {        
        dateTimeIntervalId: dateTimeIntervalId,
        weatherIntervalId: weatherIntervalId,
        forecastIntervalId: forecastIntervalId,
        todoisIntervalId: todoisIntervalId
      }
    );
  }

  componentDidMount(){
    getConfig().then((configData) =>{
      this.setState({config: configData});
      this.initaliseData();
      saveConfig(configData);
    }
  )}

  setDynamicColour(){
    var date = this.state.dateTime;
    var datePart = date.getDate() + '' + date.getMonth() + 1 + '' + date.getHours();
    var conditionAddition = this.state.weatherData.conditionId * 1024;
    var dynamicValue = datePart + conditionAddition;

     // Parse string as Base16 (hex)
    var hex = parseInt(dynamicValue, 10).toString(16);   
    
    // If it's less than six, trim it to three
    if ( hex.length < 7 ) {
        hex = hex.substring(0,3);
    }
    // Limit it to six chars for CSS styles
    var dynamicColour = '#' + hex.substring( 1, 7 );

    this.setState({currentDynamicColour: dynamicColour});
  }  

  setTodoKey(key){
    var config = this.state.config;
    config.todoistApiKey = key.key;
    this.setState({
      config: config
    });    
    getTasks(this.dataCallback, this.state.config.todoistApiKey);
    getTags(this.dataCallback, this.state.config.todoistApiKey);
  }

  switchScreen(screenName){
    let previousScreen = this.state.currentScreen;
    this.setState({
      currentScreen: screenName,
      previousScreen: previousScreen
    });
  }  

  setColourScheme(scheme){
    var config = this.state.config;
    config.colourScheme = scheme;
    this.setState({
      config: config
    });
  }

  setStaticColour(colour){
    var config = this.state.config;
    config.staticColour = colour;
    this.setState({
      config: config
    });
  }  

  setConfig(){
    saveConfig(this.state.config);
  }

  render(){
    const backgroundColor = this.state.config.colourScheme === "1" ? this.state.currentDynamicColour : this.state.config.staticColour;
    const containerStyle = { backgroundColor : backgroundColor };    
    return(
      <div className='wrapper noselect'>       
        <div className='container centre' style={containerStyle}> 
          <TodoScreen
            weatherData = {this.state.weatherData}
            config = {this.state.config}
            dateTime = {this.state.dateTime}            
            show = {this.state.currentScreen === "TODO"}
            switchScreen = {(screenName) => this.switchScreen(screenName)}            
            handleSubmit={(task) => createTask(task, this.dataCallback, this.state.config.todoistApiKey)}
            handleUpdate={(task) => updateTask(task, this.dataCallback, this.state.config.todoistApiKey)}
            handleDelete={(id) => deleteTask(id, this.dataCallback)}            
            handleComplete={(id) => completeTask(id, this.dataCallback, this.state.config.todoistApiKey)}
            handleSelect={(id) => getTask(id, this.dataCallback, this.state.config.todoistApiKey)}
            tasks ={this.state.tasks}
            tags={this.state.tags}
            currentTask={this.state.currentTask}
          />                   
          <WeatherScreen
            weatherData = {this.state.weatherData}
            config = {this.state.config}
            dateTime = {this.state.dateTime}
            forecastItems = {this.state.forecastItems}
            show = {this.state.currentScreen === "WEATHER"}
            switchScreen = {(screenName) => this.switchScreen(screenName)}
            tags={this.state.tags}
            tasks ={this.agenda()}            
            handleUpdate={(task) => updateTask(task, this.dataCallback)}
            handleDelete={(id) => deleteTask(id, this.dataCallback)}
            handleComplete={(id) => completeTask(id, this.dataCallback, this.state.config.todoistApiKey)}
            handleSelect={(id) => getTask(id, this.dataCallback, this.state.config.todoistApiKey)}
          />
          <ConfigScreen      
            config = {getConfig()}   
            dateTime = {this.state.dateTime}
            show = {this.state.currentScreen === "CONFIG"}
            switchScreen = {(screenName) => this.switchScreen(screenName)}
            setColourScheme = {(scheme) => this.setColourScheme(scheme)}
            setStaticColour = {(colour) => this.setStaticColour(colour)}
            setCountry = {(country) => this.setCountry(country)}            
            setCity = {(city) => this.setCity(city)}
            countries = {this.state.countries}
            cities = {this.state.cities}
            previousScreen = {this.state.previousScreen}
            setTodokey = {key => this.setTodoKey(key)}
            setConfig = {() => this.setConfig()} 
          />
        </div>
      </div>
    );
  }
}

export default App;
