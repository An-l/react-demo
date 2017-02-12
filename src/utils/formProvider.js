import React, { PropTypes } from 'react'

function formProvider (fields) {
    return function (Component) {

        const initFormState = {};

        for (let key in fields) {
            initFormState[key] = {
                value: fields[key].defaultValue,
                error: ''
            };
        }

        class FormComponent extends React.Component {
            constructor(props) {
                super(props);

                this.state = {
                    form: initFormState,
                    formValid: false
                };

                this.handleValueChange = this.handleValueChange.bind(this);
                this.setFormValues = this.setFormValues.bind(this);
            }

            setFormValues (values) {
                if (!values) {
                    return;
                }

                const { form } = this.state;
                let newForm = {...form};

                for (const field in form) {
                    if (form.hasOwnProperty(field)) {
                        if (typeof values[field] !== 'undefined') {
                            newForm[field] = {...newForm[field], value: values[field]};
                        }
                        // 正常情况下主动设置的每个字段一定是有效的
                        newForm[field].valid = true;
                    }
                }

                this.setState({
                    form: newForm
                });
            }

            handleValueChange (fieldName, value) {
                const { form } = this.state;
                // 根据传入的fieldName从this.state.form取得相应表单的value
                const fieldState = form[fieldName];

                const newFieldState = {...fieldState, value, valid:true, error:''};

                // 根据fieldName从传入参数fields中取得rules
                const fieldRules = fields[fieldName].rules;

                for (var i = 0; i < fieldRules.length; i++) {
                    const {pattern, error} = fieldRules[i];
                    let valid = false;

                    // 如果rules中验证方式为 function，直接运行验证方法
                    if (typeof pattern === 'function') {
                        valid = pattern(value);
                    } else {
                    // 如果rules中验证方式为 正则表达式
                        valid = pattern.test(value);
                    }

                    // 如果其中一个表单项不符合，则整个表单不通过，break退出循环
                    if (!valid) {
                        newFieldState.valid = false;
                        newFieldState.error = error;
                        break;
                    }
                }

                const newForm = {...form, [fieldName]: newFieldState};

                // 遍历newForm的值，返回值为false的项;
                // formValid = true||false
                const formValid = Object.values(newForm).every(f => f.valid);

                this.setState({
                    form: newForm,
                    formValid
                });
            }

            render () {
                const {form, formValid} = this.state;

                return <Component
                    {...this.props}
                    form={form}
                    formValid={formValid}
                    onFormChange={this.handleValueChange}
                    setFormValues={this.setFormValues}/>
            }
        }

        return FormComponent;
    }
}



export default formProvider;
