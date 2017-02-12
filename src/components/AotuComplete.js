import React, { PropTypes } from 'react'

import style from '../styles/auto-complete.css'

function getItemValue (item) {
    return item.value || item;
}

class AutoComplete extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            displayValue: '',
            activeItemIndex: -1
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleEnter = this.handleEnter.bind(this);
        this.handleLeave = this.handleLeave.bind(this);
        this.moveItem = this.moveItem.bind(this);
    }

    static PropTypes = {
        value: PropTypes.string.isRequired,
        options: PropTypes.array.isRequired,
        onValueChange: PropTypes.func.isRequired
    }



    handleChange (value) {
        // 在用户输入、选择列表项的时候重置内部状态
        //（清空displayName、设置activeItemIndex为-1）
        this.setState({
            activeItemIndex: -1,
            displayValue: value
        });

        // 通过回调将新的值传递给组件使用者
        this.props.onValueChange(value);
    }

    handleKeyDown (e) {
        const {activeItemIndex} = this.state;
        const {options} = this.props;

        switch (e.keyCode) {
            // 按下回车键
            case 13:
                if (activeItemIndex >= 0) {
                    e.preventDefault();
                    e.stopPropagation();

                    this.handleChange(getItemValue(options[activeItemIndex]));
                }
                break;

            // 按下 上方向键 or 下方向键
            case 38:
            case 40: {
                e.preventDefault();

                 // 使用moveItem方法,更新或取消选中项
                this.moveItem(e.keyCode === 38 ? 'up' : 'down')
                break;
            }
        }
    }

    // 鼠标移入
    handleEnter (index) {
        const currentItem = this.props.options[index];

        this.setState({
            activeItemIndex: index,
            displayValue: getItemValue(currentItem)
        });
    }

    // 鼠标移出
    handleLeave () {
        this.setState({
            activeItemIndex: -1,
            displayValue: ''
        });
    }

    moveItem (direction) {
        const {activeItemIndex} = this.state;
        const {options} = this.props;
        const lastIndex = options.length - 1;
        let newIndex = -1;

         // 计算新的activeItemIndex
        if (direction === 'up') {
            // 按 上方向键
            if (activeItemIndex === -1) {
                // 如果没有选中项则选择最后一项
                newIndex = lastIndex;
            } else {
                newIndex = activeItemIndex -1;
            }
        } else {
            // 按 下方向键
            if (activeItemIndex < lastIndex) {
                newIndex = activeItemIndex + 1;
            }
        }

        // 获取新的displayValue
        let newDisplayValue = ''
        if (newIndex >= 0) {
            newDisplayValue = getItemValue(options[newIndex]);
        }

        this.setState({
            displayValue: newDisplayValue,
            activeItemIndex: newIndex
        });
    }

    render () {
        const {displayValue, activeItemIndex} = this.state;
        const {value, options} = this.props;

        return (
            <div className={style.wrapper}>
                <input value={displayValue}
                    onChange={e => this.handleChange(e.target.value)}
                    onKeyDown={this.handleKeyDown} />
                {options.length > 0 && (
                    <ul className={style.options}
                        onMouseLeave={this.handleLeave}>
                        {
                            options.map((item, index) => {
                                return (
                                    <li key={index}
                                        className={index === activeItemIndex ? style.active : '' }
                                        onMouseEnter={() => this.handleEnter(index)}
                                        onClick={() => this.handleChange(getItemValue(item))} >
                                        {item.text || item}
                                    </li>
                                );
                            })
                        }
                    </ul>
                )}
            </div>
        )
    }
}

export default AutoComplete;
