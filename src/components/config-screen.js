/*jshint esversion: 6 */
import React, {Component} from 'react';
import RadioButtons from './radio-buttons.js';
import ColourPicker from './colour-picker.js';
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class ConfigScreen extends Component{   
    

    constructor(props){
        super(props);
        this.state = {};
        this.props.config.then((data) =>{
            this.state = data;            
        })
    }

    componentDidMount(){
        
    }

    onColourSchemeChange(scheme){
        this.setState({colourScheme:scheme});
        this.props.setColourScheme(scheme);
    }

    onStaticColourChange(colour){
        this.setState({staticColour: colour});
        this.props.setStaticColour(colour);
    }

    onTodoKeyChange(key){     
        this.props.setTodokey({key});
    }

    onSaveClick(){
        this.props.setConfig();
        this.props.switchScreen(this.props.previousScreen);
    }

    render(){
        const panelClass = this.props.show ?
            "screen flex flex-columns centre collapse show" :
            "screen flex flex-columns centre collapse hide";
        return(
            <div id="config-panel" className={panelClass}>    
                <div className="panel flex flex-columns centre min">
                    <a href="https://todoist.com/app/settings/integrations/developer" target="_blank" rel="noreferrer"><span>Todoist Key</span></a>
                    <input  id="todoist_key"
                            name="todoist_key"  
                            onChange={(key) => this.onTodoKeyChange(key.target.value)}
                            value={this.state.todoistApiKey}/>
                </div>            
                <div className="panel flex flex-columns centre min">
                    <span>Colour Scheme</span> 
                    <div className="flex flex-rows centre min small-font">
                        <RadioButtons                            
                            name = "colour-scheme-radio"
                            options = {[
                                        {key: "colour-scheme-radio-1", label: "Dynamic", value: "1"},
                                        {key: "colour-scheme-radio-2", label: "Static", value: "2"}
                                      ]}
                            selectedValue = {this.props.config.colourScheme}
                            onChange = {(scheme) => this.onColourSchemeChange(scheme)}
                        />                        
                    </div> 
                </div>
                <div className="panel flex flex-columns centre min"> 
                    <span>Static Colour</span> 
                    <ColourPicker
                        selectedValue={this.props.config.staticColour}
                        onChange = {(colour) => this.onStaticColourChange(colour)}
                        className = "colour-picker"
                    />               
                </div>   
                <button id="save-config" className="button" onClick={() => this.onSaveClick()}><FontAwesomeIcon icon={faSave} /></button>                
            </div>
        )
    }
}

export default ConfigScreen;