import React, {Component} from 'react';
import './Report.css';
import Menu from './Menu';
import BalanceSheet from './Tables/BalanceSheet';
import IncomeStatement from './Tables/IncomeStatement';
import Header from '../Header';
import $ from 'jquery';
import {Dropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap';

class Report extends Component {
    constructor(props){
        super(props);

        this.state = {
            presentIncomeStatement: false,
            currencies: []
        }

        this.handleIncomeStatementTapped = this.handleIncomeStatementTapped.bind(this);
        this.handleBalanceSheetTapped = this.handleBalanceSheetTapped.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
    }

    handleIncomeStatementTapped() {

        this.setState({
            presentIncomeStatement : false
        })

        console.log("in income")

    }

    handleBalanceSheetTapped() {

        this.setState({
            presentIncomeStatement : true
        })

        console.log("in balance")
    }
    //getting all the different currencies
    componentDidMount() {
        $.ajax({
            url: "http://localhost:4000/currencies/currencies",
           type: "GET",
           contentType: "application/json; charset=utf-8",
           crossDomain: true,
           dataType:"json",
           xhrFields: { withCredentials:true },
           success: (data) => {
               let currencies = []
                for (let i = 0; i < data.currencies.length; i++) {
                    const newRow = {value: '', label: ''};
                    newRow.value = data.currencies[i];
                    newRow.label = data.currencies[i];
                    currencies[i] = newRow;
                }
                this.setState({currencies: currencies });
           },
           error: () => {
                console.log("Error: Could not fetch data");
           }
        });
    }
    //
    //
    // showBalanceSheet(event){
    //     this.setState({
    //         balance : true
    //     })
    // }
    //
    // showIncomeStatement(event){
    //     this.setState({
    //         balance : false
    //     })
    // }

    render(){

        const currentSheet = () => {
            if (this.state.presentIncomeStatement == true) {
                return <IncomeStatement action={this.handleIncomeStatementTapped} currencies={this.state.currencies}/>

            }
            return <BalanceSheet action={this.handleBalanceSheetTapped} currencies={this.state.currencies}/>
        }

        return(
            <body className="reportsRootContainer">
                <Header/>
                <div className="reportsTitle"><h1>Reports</h1></div>

                {currentSheet()}


            </body>
            // {/*<div>*/}
            //     {/*<Header />*/}
            //     {/*<div class="container">*/}
            //         {/*<div class="sheets">*/}
            //             {/*<h1 align="center">Reports Page</h1>*/}
            //
            //             {/*<div className="reports-options">*/}
            //                 {/*<Menu className="reports-menu" setBalanceSheet={this.showBalanceSheet.bind(this)} setIncomeStatement={this.showIncomeStatement.bind(this)}/>*/}
            //                 {/**/}
            //                 {/*<CurrencyMenu />*/}
            //             {/*</div>*/}
            //
            //             {/*{this.state.balance ? */}
            //             {/*<BalanceSheet /> :*/}
            //             {/*<IncomeStatement /> }*/}
            //         {/*</div>*/}
            //         {/*<div class="diagrams">*/}
            //             {/*/!**/}
            //                 {/*Need to figure out how to display graphs and diagrams before this is workable*/}
            //             {/**!/*/}
            //         {/*</div>*/}
            //     {/*</div>*/}
            // {/*</div>*/}

        );
    }
}

export default Report;