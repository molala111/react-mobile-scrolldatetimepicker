import React, { Component, PropTypes } from 'react';
import * as TimeUtil from './time.js';
import { shallowEqual } from './pureRender.js';
import { addPrefixCss, formatCss } from './prefix.js';

const DATE_HEIGHT = 40;
const DATE_LENGTH = 10;
const MIDDLE_INDEX = Math.floor(DATE_LENGTH / 2);
const MIDDLE_Y = - DATE_HEIGHT * MIDDLE_INDEX;


class DatePickerItem extends Component {
    constructor(props) {
        super(props);
        this.animating = false;
        this.touchY = 0;
        this.translateY = 0;
        this.currentIndex = MIDDLE_INDEX;

        this.state = {
            translateY: MIDDLE_Y,
            marginTop: (this.currentIndex - MIDDLE_INDEX) * DATE_HEIGHT,
        };

        this.renderDatepickerItem = this.renderDatepickerItem.bind(this);
        this.handleContentTouch = this.handleContentTouch.bind(this);
        this.handleContentMouseDown = this.handleContentMouseDown.bind(this);
        this.handleContentMouseMove = this.handleContentMouseMove.bind(this);
        this.handleContentMouseUp = this.handleContentMouseUp.bind(this);
    }

    componentWillMount() {
        this._iniDates(this.props.value);
    }


    componentWillReceiveProps(nextProps) {
        if (nextProps.value.getTime() === this.props.value.getTime()) {
            return;
        }
        this._iniDates(nextProps.value);
        this.currentIndex = MIDDLE_INDEX;
        this.setState({
            translateY: MIDDLE_Y,
            marginTop: (this.currentIndex - MIDDLE_INDEX) * DATE_HEIGHT,
        });
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.value.getTime() !== this.props.value.getTime() ||
            !shallowEqual(nextState, this.state);
    }

    _iniDates(date) {
        const { typeName } = this.props;

        const dates = Array(...Array(DATE_LENGTH))
            .map((value, index) =>
                TimeUtil[`next${typeName}`](date, index - MIDDLE_INDEX));
        this.setState({ dates });
    }

    _updateDates(direction) {
        const { typeName } = this.props;
        const { dates } = this.state;

        if (direction === 1) {
            this.currentIndex ++;
            this.setState({
                dates: [
                    ...dates.slice(1),
                    TimeUtil[`next${typeName}`](dates[dates.length - 1], 1),
                ],
                marginTop: (this.currentIndex - MIDDLE_INDEX) * DATE_HEIGHT,
            });
        } else {
            this.currentIndex --;
            this.setState({
                dates: [
                    TimeUtil[`next${typeName}`](dates[0], -1),
                    ...dates.slice(0, dates.length - 1),
                ],
                marginTop: (this.currentIndex - MIDDLE_INDEX) * DATE_HEIGHT,
            });
        }
    }

    _checkIsUpdateDates(direction, translateY) {
        return direction === 1 ?
            this.currentIndex * DATE_HEIGHT + DATE_HEIGHT / 2 < -translateY :
            this.currentIndex * DATE_HEIGHT - DATE_HEIGHT / 2 > -translateY;
    }

    _clearTransition(obj) {
        addPrefixCss(obj, { transition: '' });
    }

    _moveToNext(direction) {
        const date = this.state.dates[MIDDLE_INDEX];
        const { max, min } = this.props;
        if (direction === -1 && date.getTime() < min.getTime()) {
            this._updateDates(1);
        } else if (direction === 1 && date.getTime() > max.getTime()) {
            this._updateDates(-1);
        }

        this._moveTo(this.refs.scroll, this.currentIndex);
    }

    _moveTo(obj, currentIndex) {
        this.animating = true;

        addPrefixCss(obj, { transition: 'transform .2s ease-out' });

        this.setState({
            translateY: -currentIndex * DATE_HEIGHT,
        });

        // NOTE: There is no transitionend, setTimeout is used instead.
        setTimeout(() => {
            this.animating = false;
            this.props.onSelect(this.state.dates[MIDDLE_INDEX]);
            this._clearTransition(this.refs.scroll);
        }, 200);
    }

    handleStart(event) {
        this.touchY = event.pageY || event.targetTouches[0].pageY;
        this.translateY = this.state.translateY;
    }


    handleMove(event) {
        const touchY = event.pageY || event.targetTouches[0].pageY;
        const dir = touchY - this.touchY;
        const translateY = this.translateY + dir;
        const direction = dir > 0 ? -1 : 1;

        const date = this.state.dates[MIDDLE_INDEX];
        const { max, min } = this.props;
        if (date.getTime() < min.getTime() ||
            date.getTime() > max.getTime()) {
            return;
        }

        if (this._checkIsUpdateDates(direction, translateY)) {
            this._updateDates(direction);
        }

        this.setState({ translateY });
    }

    handleEnd(event) {
        const touchY = event.pageY || event.changedTouches[0].pageY;
        const dir = touchY - this.touchY;
        const direction = dir > 0 ? -1 : 1;
        this._moveToNext(direction);
    }

    handleContentTouch(event) {
        event.preventDefault();
        if (this.animating) return;
        if (event.type === 'touchstart') {
            this.handleStart(event);
        } else if (event.type === 'touchmove') {
            this.handleMove(event);
        } else if (event.type === 'touchend') {
            this.handleEnd(event);
        }
    }

    handleContentMouseDown(event) {
        if (this.animating) return;
        this.handleStart(event);
        document.addEventListener('mousemove', this.handleContentMouseMove);
        document.addEventListener('mouseup', this.handleContentMouseUp);
    }

    handleContentMouseMove(event) {
        if (this.animating) return;
        this.handleMove(event);
    }

    handleContentMouseUp(event) {
        if (this.animating) return;
        this.handleEnd(event);
        document.removeEventListener('mousemove', this.handleContentMouseMove);
        document.removeEventListener('mouseup', this.handleContentMouseUp);
    }

    renderDatepickerItem(date, index) {
        const className =
            (date < this.props.min || date > this.props.max) ?
            'disabled' : '';

        return (
            <li
                key={index}
                className={className}>
                {TimeUtil.convertDate(date, this.props.format)}
            </li>
        );
    }

    render() {
        const scrollStyle = formatCss({
            transform: `translateY(${this.state.translateY}px)`,
            marginTop: this.state.marginTop,
        });

        return (
            <div className='datepicker-col-1'>
                <div
                    className='datepicker-viewport'
                    onTouchStart={this.handleContentTouch}
                    onTouchMove={this.handleContentTouch}
                    onTouchEnd={this.handleContentTouch}
                    onMouseDown={this.handleContentMouseDown}>
                    <div className='datepicker-wheel'>
                        <ul
                            ref='scroll'
                            className='datepicker-scroll'
                            style={scrollStyle}>
                            {this.state.dates.map(this.renderDatepickerItem)}
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}



export default DatePickerItem;
