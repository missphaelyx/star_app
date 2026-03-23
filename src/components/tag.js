// src/components/contacts.js
/*jshint esversion: 6 */

import React from 'react';
import { faTag } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class Tag extends React.Component{    
    render(){
        return(
            <div className="tag-label">
                <FontAwesomeIcon icon={faTag} /> {this.props.name}
            </div>
        )
    }
}

class TagCheckBox extends React.Component{
   
    onCheckBoxChanged = (e) =>{
        if(e.target.checked){
            this.props.addTag(e.target.value);
        }
        else{
            this.props.removeTag(e.target.value);
        }
    }

    tagId = () =>{
        return this.props.tag.name + '_' + this.props.parent;
    } 

    render(){
        return(                
            <li>
                <input type="checkbox" name={this.props.tag.name} id={this.tagId()} value={this.props.tag.name} onChange={this.onCheckBoxChanged} />
                <label className="tag-label" htmlFor={this.tagId()}><FontAwesomeIcon icon={faTag}/> {this.props.tag.name}</label>
            </li>
        )
    }
}

export {
    Tag,
    TagCheckBox
}