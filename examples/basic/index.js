import './main.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { convertDate } from '../../lib/time.js';
import DateTimePicker from '../../lib/index';

// import DateTimePicker from '../../dist/react-mobile-datetimepicker';

window.Perf = require('react-addons-perf');

(function main() {
    class App extends React.Component {
        state = {
            time: new Date(),
            isOpen: false,
            theme: 'default',
        }

        handleToggle = (isOpen) => () => {
            this.setState({ isOpen });
        }

        handleThemeToggle = (theme) => () => {
            console.log(theme);
            this.setState({ theme, isOpen: true });
        }

        handleSelect = (time) => {
            this.setState({ time, isOpen: false });
        }

        render() {
            return (
                <div className='App'>
                    <p className='select-time '>
                        {convertDate(this.state.time, 'YYYY-MM-DD hh:mm')}
                    </p>
                    <div>
                        <a
                            className='select-btn sm'
                            onClick={this.handleThemeToggle('default')}>
                            default
                        </a>
                        <a
                            className='select-btn sm'
                            onClick={this.handleThemeToggle('dark')}>
                            dark
                        </a>
                        <a
                            className='select-btn sm'
                            onClick={this.handleThemeToggle('ios')}>
                            ios
                        </a>
                        <a
                            className='select-btn sm'
                            onClick={this.handleThemeToggle('android')}>
                            android
                        </a>
                        <a
                            className='select-btn sm'
                            onClick={this.handleThemeToggle('android-dark')}>
                            android-dark
                        </a>
                    </div>
                    <DateTimePicker
                        value={this.state.time}
                        theme={this.state.theme}
                        isOpen={this.state.isOpen}
                        onSelect={this.handleSelect}
                        onCancel={this.handleToggle(false)} />
                </div>
            );
        }
    }


    ReactDOM.render(<App />, document.getElementById('react-box'));
}());
