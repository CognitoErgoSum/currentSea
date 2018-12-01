import React from 'react';
import './EditEntry.css';
import $ from 'jquery'

export default class EditEntry extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            data : [{
                dt_accountID : '9000 Bank',
                dt_debit : 0,
                dt_credit : 0,
                dt_eventID : 'Party',

                dt_transactionID : 0,
                
            }],
            action_id : 0,
            update : false,
        }
        this.addinfo = this.addinfo.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.save = this.save.bind(this);
        this.remove = this.remove.bind(this);
    }

    addinfo = () => {
        var internalEntries = this.state.data.slice(0);

        let newRow = {
            dt_accountID : '9000 Bank',
            dt_debit : 0,
            dt_credit : 0,
            dt_eventID : '',

            dt_transactionID : this.state.data.length,
        };

        internalEntries.push(newRow);
    
        this.state.data = internalEntries;
        this.forceUpdate();
    }

    handleChange(row, entry, event) {
        row[entry] = event.target.type === 'number' ? parseFloat(event.target.value) : event.target.value;
    }

    save(){
        $.ajax({
            url: "http://localhost:4000/transactions/edit_transactions",
            type: "POST",
            contentType: "application/json; charset=utf-8",
            crossDomain: true,
            dataType:"json",
            xhrFields: { withCredentials:true },
            data: JSON.stringify(this.state.data),
            success: () => {
                 this.props.action(this.state.action_id);
            },
            error: () => {
                 console.log("Error: Could not submit");
                 this.props.action(this.state.action_id);
            }
        })
    }

    remove(){
        $.ajax({
            url: "http://localhost:4000/transactions/delete_transactions",
            type: "DELETE",
            contentType: "application/json; charset=utf-8",
            crossDomain: true,
            dataType:"json",
            xhrFields: { withCredentials:true },
            data: JSON.stringify(this.state.action_id),
            success: () => {
                 this.props.action(this.state.action_id);
            },
            error: () => {
                 console.log("Error: Could not submit");
                 this.props.action(this.state.action_id);
            }
        })
    }

    componentDidMount(){
        $.ajax({
            url: "http://localhost:4000/transactions/get_details",
            type: "POST",
            contentType: "application/json; charset=utf-8",
            crossDomain: true,
            dataType:"json",
            xhrFields: { withCredentials:true },
            data: JSON.stringify({'tt_transaction_id': this.props.id}),
            success: (receivedData) => {
                this.setState({
                    data: receivedData
                })
                console.log(this.state.data);
                console.log(receivedData);
                console.log(this.props.id);

                console.log(receivedData);
                if(receivedData){
                    this.setState({
                        data: receivedData
                    });
                }
                if(this.props.id){
                    this.setState({
                        action_id: this.props.id,
                    })
                } 
            },
            error: () => {
                console.log("Error: Could not submit");
            }
        })
    }

    render(){
        return(
            <div>
                <table>
                    <thead id='headEntry'>
                        <tr>
                            <th>Account</th>
                            <th>Debit</th>
                            <th>Credit</th>
                            <th>Event</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.data.map(row => {
                            return (
                                <tr key={`row-${row.dt_transactionID}`}>
                                    <td><input type="text" defaultValue={row.dt_accountID} onChange={(e) => this.handleChange(row, 'dt_accountID', e)}/></td>
                                    <td><input type="number"  defaultValue={row.dt_debit} onChange={(e) => this.handleChange(row, 'dt_debit', e)}/></td>
                                    <td><input type="number" defaultValue={row.dt_credit} onChange={(e) => this.handleChange(row, 'dt_credit', e)}/></td>
                                    <td><input type="text"  defaultValue={row.dt_eventID} onChange={(e) => this.handleChange(row, 'dt_eventID', e)}/></td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                <button onClick={this.addRow}>Add +</button>
                <button onClick={this.save}>Save</button>
                <button id='entryButton' onClick={this.remove}>Delete</button>
            </div>
            
        );
    }
}