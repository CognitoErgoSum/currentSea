import React from 'react';
import DatePicker from 'react-datepicker'
import moment from "moment"
import "react-datepicker/dist/react-datepicker.css";
import './AddEntry.css'
import $ from 'jquery'

export default class AddEntry extends React.Component{

    constructor(props){
        super(props);

        this.state = {
            newData : {
                startDate : moment().format('YYYY-MM-DD'),
                currencyId: '',
                description: 'Description',
                balance : 0.00,
                internalEntries : [],
            },
            enteringData : false,
            dateSetter : moment(),
        }
        this.setDate = this.setDate.bind(this);
        this.addinfo = this.addinfo.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleCurrency = this.handleCurrency.bind(this);
        this.handleDescription = this.handleDescription.bind(this);
        this.handleCurrency = this.handleCurrency.bind(this);
        this.submitData = this.submitData.bind(this);
    }

    setDate(date){
        let newData = Object.assign({}, this.state.newData);
        this.setState({
            dateSetter : date
        });
        newData.startDate = moment(this.state.dateSetter).format('YYYY-MM-DD');
        this.setState({newData});
    }

    addinfo = () => {
        var internalEntries = this.state.newData.internalEntries.slice(0);

        let newRow = {
            account : '9000 Bank',
            debit : 0,
            credit : 0,
            event : 'Party',

            id : this.state.newData.internalEntries.length,
        };

        internalEntries.push(newRow);
    
        this.state.newData.internalEntries = internalEntries;
        this.forceUpdate();
    }

    handleDescription(e){
        let newData = Object.assign({}, this.state.newData);
        newData.description = e.target.value;
        this.setState({newData});
    }

    handleCurrency(e){
        let newData = Object.assign({}, this.state.newData);
        newData.currencyId = e.target.value;
        this.setState({newData})
    }

    handleChange(row, entry, event) {
        row[entry] = event.target.type === 'number' ? parseFloat(event.target.value) : event.target.value;
    }

    submitData(){
        var sum = 0;
        let newData = Object.assign({}, this.state.newData);
        for(let i = 0; i < this.state.newData.internalEntries.length; i++){
            sum += this.state.newData.internalEntries[i].debit;
        }
        newData.balance = sum;     
        this.setState({
            newData : newData,
        });

        /*
            Ajax magic 
            Maybe we should send the internal entries back home instead of newData? We need to avoid losing information one way or another.
        */
       $.ajax({
           url: "http://localhost:4000/transactions/add_transactions",
           type: "POST",
           contentType: "application/json; charset=utf-8",
           crossDomain: true,
           dataType:"json",
           xhrFields: { withCredentials:true },
           data: JSON.stringify(this.state.newData),
           success: () => {
                this.props.action(false);
           },
           error: () => {
                console.log("Error: Could not submit");
                this.props.action(false);
           }
       })
    
    }

    render(){
        return(
            <div>
                {this.props.addEntry ? 
                <div>
                    <table width='600' id='addTable'>
                        <thead>
                            <tr>
                                <th><DatePicker selected={this.state.dateSetter} onChange={this.setDate} popperPlacement='left-start'/></th>
                                <th><input type="text" placeholder="Description" onChange={this.handleDescription} /></th>
                                <th><input type="text" placeholder="Currency"  onChange={this.handleCurrency} /></th>
                            </tr>
                            <tr>
                                <th>Account</th>
                                <th>Debit</th>
                                <th>Credit</th>
                                <th>Event</th>
                            </tr>
                        </thead>
                    
                        <tbody>
                            {this.state.newData.internalEntries.map(row => {
                                return (
                                    <tr key={`row-${row.id}`}>
                                        <td><input type="text" placeholder="Account" onChange={(e) => this.handleChange(row, 'account', e)}/></td>
                                        <td><input type="number"  placeholder="Debit" onChange={(e) => this.handleChange(row, 'debit', e)}/></td>
                                        <td><input type="number" placeholder="Credit" onChange={(e) => this.handleChange(row, 'credit', e)}/></td>
                                        <td><input type="text"  placeholder="Event" onChange={(e) => this.handleChange(row, 'event', e)}/></td>
                                    </tr>
                                )
                            })}
                        </tbody>     
                    </table>
                    <button onClick={this.addinfo}>Add +</button>
                    <button onClick={this.submitData}>Done</button>
                </div>
                : (null) }
            </div>
        );
    }
}