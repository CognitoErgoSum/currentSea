import React from 'react';
import './Events.css';
import AddEvent from './AddEvent';
import $ from 'jquery'
import {confirmAlert} from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'


export default class Events extends React.Component {
    constructor(props) {
        super(props);
        this.state = {


            showAddEntry: false,
            update: false,
            editableData: {},
            editUpdate: false,

            currentData: [{
                et_event_abv: 'NE',
                et_event_name: 'No Event',
                et_event_id: 42,
                et_event_color: '',

            },]

        }
        this.addRow = this.addRow.bind(this);
        this.closeRow = this.closeRow.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.addToTable = this.addToTable.bind(this);
        this.deleteRowE = this.deleteRowE.bind(this);
    }

    addRow = () => {
        if (this.state.showAddEntry === false) {
            this.setState({
                showAddEntry: true
            });
        } else {
            this.setState({
                showAddEntry: false

            });
        }
    }

    addToTable(data) {
        this.setState({
            update: true
        })

    }

    closeRow(id) {
        this.state.showAddEntry = id;
        this.state.update = true;
        this.forceUpdate();
    }

  

    deleteRowE(e, et_event_id) {
        let index = this.state.currentData.findIndex(x => x.et_event_id == et_event_id);
        let rowDataVar = {eventId: et_event_id}
        confirmAlert({
            title: 'Confirm Deletion',
            message: 'Are you sure you want to delete this event permanently?',
            buttons: [
                {
                    label: 'Ok',
                    onClick: () => $.ajax({
                        url: "http://localhost:4000/event/delete_event",
                        type: "POST",
                        contentType: "application/json; charset=utf-8",
                        crossDomain: true,
                        dataType: "json",
                        xhrFields: {withCredentials: true},
                        data: JSON.stringify(rowDataVar),
                        success: (data) => {
                            this.setState({
                                update: true
                            });
                        },
                        error: (data) => {
                             console.log("Error: Could not submit");
                             alert(data.responseJSON.message);
                        }
                    })
                },
                {
                    label: 'Cancel',
                    onClick: () => this.forceUpdate()
                }
            ]
        })


    }
    

   
    


    componentDidMount() {
        $.ajax({
            url: "http://localhost:4000/event/get_all_events/",
            type: "GET",
            contentType: "application/json; charset=utf-8",
            crossDomain: true,
            dataType: "json",
            xhrFields: {withCredentials: true},
            success: (data) => {
                console.log("what is this ", data);
                this.setState({

                    currentData: data

                });
            },
            error: () => {
                console.log("Error: Could not update.");
            }
        });
    }


    render() {
        if (this.state.update === true) {
            $.ajax({
                url: "http://localhost:4000/event/get_all_events/",
                type: "GET",
                contentType: "application/json; charset=utf-8",
                crossDomain: true,
                dataType: "json",
                xhrFields: {withCredentials: true},
                success: (data) => {
                    this.setState({
                        currentData: data,
                        update: false
                    });

                },
                error: () => {
                    console.log("Error: Could not update.");
                    this.setState({
                        update: false
                    })
                }
            });
        }
        return (
            <div>
                <table className="eventsTable">

                    <col width={100}/>
                    <col width={200}/>
                    <col width={100}/>
                    <col width={100}/>

                    <thead>
                        <tr>
                            <th>Abbr.</th>
                            <th>Name</th>
                            <th>Color</th>
                            <th></th>

                        </tr>
                        <tr>
                            <th colSpan='4'>
                                <button id='addEventButton' onClick={e => this.addRow()}>+</button>
                                {this.state.showAddEntry ?
                                    <div><AddEvent addEntry={this.state.showAddEntry} add={this.addToTable}
                                                action={this.closeRow}/></div> : <span></span>}
                            </th>
                        </tr>
                    </thead>
                    <tbody>

                    {this.state.currentData.map(row => {
                        return (
                            <tr key={`row-${row.et_event_id}`}>
                                <td scope="row">{row.et_event_abv}</td>
                                <td>{row.et_event_name}</td>
                                <td>{<svg height="25" width="25">
                                    <circle cx="12.5" cy="12.5" r="10" stroke={row.et_event_color} stroke-width="1" fill= {row.et_event_color} />
                                </svg>}</td>
                                <td>
                                    <button className="accountDeleteButton"
                                            onClick={e => this.deleteRowE(e, row.et_event_id)}> x
                                    </button>
                                </td>
                            </tr>
                        )
                    })}
                    </tbody>
                </table>
            </div>
        );
    }
}
