import React from 'react';
import {reduxForm, Field, SubmissionError, focus} from 'redux-form';
import Input from './input';
import {required, nonEmpty, exactLength, onlyNumbers} from '../validators';

export class ComplaintForm extends React.Component {
    onSubmit(values) {
        return fetch('https://us-central1-delivery-form-api.cloudfunctions.net/api/report', {
            method: 'POST',
            body: JSON.stringify(values),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => {
                if (!res.ok) {
                    if (
                        res.headers.has('content-type') &&
                        res.headers
                            .get('content-type')
                            .startsWith('application/json')
                    ) {
                        // It's a nice JSON error returned by us, so decode it
                        return res.json().then(err => Promise.reject(err));
                    }
                    // It's a less informative error returned by express
                    return Promise.reject({
                        code: res.status,
                        message: res.statusText
                    });
                }
                return;
            })
            .then(() => console.log('Submitted with values', values))
            .catch(err => {
                const {reason, message, location} = err;
                if (reason === 'ValidationError') {
                    // Convert ValidationErrors into SubmissionErrors for Redux Form
                    return Promise.reject(
                        new SubmissionError({
                            [location]: message
                        })
                    );
                }
                return Promise.reject(
                    new SubmissionError({
                        _error: 'Error submitting message'
                    })
                );
            });
    }

    render() {
        let successMessage;
        if (this.props.submitSucceeded) {
            successMessage = (
                <div className="message message-success">
                    Message submitted successfully
                </div>
            );
        }

        let errorMessage;
        if (this.props.error) {
            errorMessage = (
                <div className="message message-error">{this.props.error}</div>
            );
        }

        return (
            <div className="delivery-from">
            <h2>Report a problem with your delivery</h2>
            <form
                onSubmit={this.props.handleSubmit(values =>
                    this.onSubmit(values)
                )}>
                <Field 
                    component={Input}
                    element="input"
                    label="Tracking Number"
                    name="trackingNumber" 
                    id="tracking-number" 
                    type="text" 
                    validate={[required, nonEmpty, exactLength, onlyNumbers]}
                    />
                <Field 
                    component={Input}
                    element="select"
                    label="What is your issue"
                    name="issue" 
                    id="issue" 
                    type="issue"
                    validate={[required]} 
                    >
                <option></option>
                <option value="not-delivered">My delivery hasn't arrived</option>
                <option value="wrong-item">The wrong item was delivered</option>
                <option value="missing-part">Part of my order was missing</option>
                <option value="damaged">Some of my order arrived damaged</option>
                <option value="other">Other (give details below)</option>
                </Field>
                <Field 
                    component={Input}
                    element="textarea"
                    label="Give more details (optional)"
                    name="other-details" 
                    id="other-details" 
                    />
                <button type="submit">Submit</button>
            </form>
            </div>
        );
    }
}

export default reduxForm({
    form: 'complaint',
    onSubmitFail: (errors, dispatch) =>
        dispatch(focus('complaint', Object.keys(errors)[0]))
})(ComplaintForm);