import React, { Component } from 'react';
import Event from "./Event/Event";
import EventDetails from "./EventDetails/EventDetails";
import { Button } from "reactstrap";
import './EventList.css'
import AddEvent from "./AddEvent/AddEvent";
import { getListEvent, getEventDetails } from '../../../Services/APIServices';
import Waypoint from '../../../../node_modules/react-waypoint';

export default class EventList extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            isOpen: false,
            isOpenAdd: false,
            eventDetail: {},
            listEvent: [],
            isLoading: false,
            page:0,
            data:{},
        }
    }   
    componentDidMount(){
        this.loadMoreItems();
    }
    loadEventDetails = async (id) =>{
        await getEventDetails(id)
             .then((res)=>{
             this.state.data = res.data;
             this.setState(this.state);
         })
    }
    toggle =  (id) => {
        this.loadEventDetails(id)
         .then(()=>{
            this.setState({
                isOpen: !this.state.isOpen,
            });
         })   
    }
    endToggle = (t) =>{
        this.state.listEvent.map((e,index)=>{
            if(e.id_eve==t.id_eve){
                this.state.listEvent[index] = t;
            }
        })
        this.setState({
            isOpen: !this.state.isOpen,
        });
        
    }
    toggleAdd = (e) => {
        this.state.listEvent.unshift(e);
        this.setState({
            isOpenAdd: !this.state.isOpenAdd,
        })
    };
    toggleAddStart = () => {
        this.setState({
            isOpenAdd: !this.state.isOpenAdd,
        })
    };
    renderEvent = () => {
        const listEvent = this.state.listEvent.map((e, index) => {
            return <Event toggle={this.toggle} data = {e}  key={index}  />;
        })
        return listEvent;
    };

    renderWaypoint = () => {
        if (!this.state.isLoading) {
            return (
                <Waypoint   onEnter={this.loadMoreItems}
                />
            );
        }
    };
    loadMoreItems = async ()=> {
        var eventsToAdd;
        await getListEvent(this.state.page)
            .then((res)=>{
                eventsToAdd = res.data.data;
            })
        // fake an async. ajax call with setTimeout
        const self = this;
        setTimeout(function () {
            // add data
            var currentItems = self.state.listEvent;
            for(var i  = 0 ; i <eventsToAdd.length; i++){
                currentItems.push(eventsToAdd[i]);
            }
            self.state.isLoading = false;
            self.state.listEvent = currentItems;
            self.setState(self.state);
        }, 2000);   
    };
    reRender = () =>{
        // this.state.listEvent = [],
        // this.setState(this.state);
        //this.loadMoreItems();
        // this.setState({ state: this.state });
    }
    render() {
        const tmp = (this.state.isOpen)?<EventDetails modal={this.state.isOpen} open={this.toggle}  toggle={this.endToggle}  data = {this.state.data} />:null;
        return (
            <div className="animated fadeIn"> 
                <div className="card">
                    <Button color={"primary"} id={'btn-pill'} onClick={this.toggleAddStart}>Thêm sự kiện</Button>
                </div>
                <AddEvent modal={this.state.isOpenAdd} toggle={this.toggleAdd} />
                {this.renderEvent()}
               {tmp} 
            </div>
        )
    }
}
