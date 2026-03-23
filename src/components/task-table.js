/*jshint esversion: 6 */

import React from 'react';

import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { faSortUp } from "@fortawesome/free-solid-svg-icons";
import { faSortDown } from "@fortawesome/free-solid-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Tag, TagCheckBox } from './tag';

import { getDueDateString, getDueDate } from '../lib/util';

class TaskTable extends React.Component{   

    constructor(props){
        super(props);
        this.state = {            
            sortOrder:"asc",
            searchParam:"",
            filterParam: "All",
            filterTags:[],
        };
    }  

    sortDateDescending(a,b) 
    {
        return getDueDate(b) - getDueDate(a);
    }

    sortDateAscending(a,b){
        return getDueDate(a) - getDueDate(b);
    }    

    onSort(e){
        if(this.state.sortOrder === "asc"){
            this.setState({sortOrder: "dsc"});
        }
        else{
            this.setState({sortOrder: "asc"});
        }
    }
    
    onFilter(e){
        let filterParam = e.target.value;
        this.setState({filterParam: filterParam});       
    }

    onSearch = (e) =>{
        e.preventDefault();
        console.log(e);
        let search = e.target[0].value;
        this.setState({searchParam: search}); 
    }

    onReset(e){
        this.setState({searchParam: ""}); 
    }

    onAddTag(e){
        var tags = this.state.filterTags;
        tags.push(e);
        this.setState({filterTags: tags}); 
    }

    onRemoveTag(e){
        var tags = this.state.filterTags;
        var tagIndex = tags.indexOf(e);
        if(tagIndex >= 0){
            tags.splice(tagIndex, 1);
        }
        this.setState({filterTags: tags}); 
    }   

    onAddNew(e){        
        this.props.activatePanel("form");
    }

    getTaskTags(task){
        return this.props.tags.filter(t => task.labels.includes(t.id));
    }

    filterCheck(taskTags, filterTags){
        return taskTags.some(v => filterTags.includes(v));
    }

    getTaskRows(){
        let tasksClone = this.props.tasks.slice();   

        tasksClone = tasksClone.filter(a => getDueDate(a) != null);      

        if(this.state.searchParam){
            tasksClone = tasksClone.filter(a => a.content.toLowerCase().includes(this.state.searchParam.toLowerCase()));            
        }        

        if(this.state.filterTags.length){         
            console.log(this.state.filterTags);
            tasksClone = tasksClone.filter(a => a.labels.some(v => this.state.filterTags.includes(v)));       
        }

        if(this.state.sortOrder === "asc"){
            tasksClone.sort((a,b) => this.sortDateAscending(a,b)); 
        }
        else{
            tasksClone.sort((a,b) => this.sortDateDescending(a,b)); 
        }
        
        return tasksClone.map(task =>         
            <TaskRow 
                key={task.id} 
                task={task}
                onDelete={(id) => this.props.onDelete(id)}
                onUpdate={(task) => this.props.onUpdate(task)}
                onComplete={(id) => this.props.onComplete(id)}
                onSelect={(id) => this.props.onSelected(id)}
                tags={this.getTaskTags(task)}                
                showDate = {this.props.showDate}
            />
        );
    }
     
    render(){   

        let toolRowClasses = 'hide';
        const tableClasses = 'task-table table table-striped';
        let listClasses = 'tiny-font fill-width';

        if(this.props.switchable){
            listClasses = this.props.activePanel === "list" ? 'collapse small show tiny-font fill-width' : 'collapse small hide tiny-font fill-width';
            toolRowClasses = 'content-panel-table table-tools-row'
        }
       
        const tagSelectors = this.props.tags.map(tag => 
            <TagCheckBox
                key = {tag.id}
                tag = {tag}
                addTag = {(tag) => this.onAddTag(tag)}
                removeTag = {(tag) => this.onRemoveTag(tag)}
                parent = "table"
            />
        ) 

        return(
            <div className={listClasses}>
                <div className={toolRowClasses}>
                    <div className="tools-wrapper">
                        <div className="form-group">
                            <button type="button" onClick={(e) => this.onAddNew(e)}>Add New <FontAwesomeIcon icon={faPlus} /></button>
                        </div>
                        <div className="form-group">                  
                            <ul className="tag-list">
                                {tagSelectors}
                            </ul>                         
                        </div>
                        <div className="form-group">
                            <form onSubmit={this.onSearch} onReset={this.onReset}>
                                <label htmlFor="search-textbox">Search</label>
                                <input type="text" id="search-textbox" />
                                <button type="submit" >Search <FontAwesomeIcon icon={faSearch} /></button>
                                <button type="reset" >Clear</button>
                            </form>
                        </div>
                        
                    </div>
                </div>        
                <div className="flex flex-columns centre tidy-scroll"> 
                    <table className={tableClasses}>
                        {this.props.showHeader === true &&         
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Tags</th>
                                    {this.props.showDate ? <th>Due <button className="sortButton" onClick={() => this.onSort()}><FontAwesomeIcon icon={this.state.sortOrder === "asc" ? faSortUp : faSortDown} /></button></th> : <td></td>}
                                    <th></th>
                                </tr>                
                            </thead>
                        }
                        <tbody>        
                            {this.getTaskRows()}
                        </tbody>                            
                    </table>  
                </div>
            </div>
        )
    }
}

class TaskRow extends React.Component{
    constructor(props){
        super(props);
        this.state = this.props.task;      
    }

    onDelete = (e) =>{
        this.props.onDelete(this.state._id);      
    }

    doUpateStatus = (status) =>{
        let task = {
            "id": this.state.id,
            "content": this.state.name,
            "Create_date": this.state.Create_date,
            "tags": this.state.tags,
            "due_date": this.state.due_date,
            "status": [status]
        }

        this.props.onUpdate(task);

        this.setState(task);  
    }

    doCompleteTask = () =>{
        this.props.onComplete(this.state.id);
    }

    doSelectTask = () =>{
        this.props.onSelect(this.state.id);
    }

    getTags = (tags) =>{             
        
        if(tags){
           return tags.map((tag, i) => (
                <Tag
                    key = {i}
                    name = {tag}
                />
            ));
         }
        else{
            return <span>no tags</span>;
        }
    }

    render(){
        return(                       
            <tr >
                <td>{this.props.task.content}</td>
                <td>{this.getTags(this.props.task.labels)}</td>
                {this.props.showDate ? <td>{getDueDateString(this.props.task)}</td> : <td></td>}
                <td className='button-column'>                    
                    <button title="complete task" className="action-button" type="button" onClick={() => this.doCompleteTask()}><FontAwesomeIcon icon={faCheck} /></button>
                    <button title="edit task" className="action-button" type="button" onClick={() => this.doSelectTask()}><FontAwesomeIcon icon={faEdit} /></button>
                </td>
            </tr>
        )
    }
}

export default TaskTable