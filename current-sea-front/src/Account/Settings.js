import React, {Component} from 'react';
import Events from './Events';
import Header from '../Header';
import Accounts from './Accounts';
import './Settings.css';

class Settings extends Component {
    constructor() {
        super();

    }


    render() {
        return (
            <div className="settingsRoot">
                <Header/>
                <h1 id="h1title">Account Settings</h1>
                <div className="settingSubHead">Here you can set up, edit and delete your accounts and events</div>



                <div className="settingsTableDiv">
                    <div className="accountsDiv">
                        <div className="settingsTableTitle">Accounts</div>
                        <Accounts/>
                    </div>

                    <div>
                        <div className="settingsTableTitle">Events</div>
                        <Events/>
                    </div>


                </div>

            </div>
        );
    }
}

export default Settings;