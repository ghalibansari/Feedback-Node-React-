import React, {Component} from 'react'
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {KeyboardDatePicker, MuiPickersUtilsProvider} from '@material-ui/pickers';
import {toastError, toastSuccess} from '../utils/toast'
import {Paper, TextField} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import {withOutTokenPost} from "../../helper/AxiosGlobal";
import {Loader} from '../utils/loader'

//style
const customStyle = {
    mainDiv: {
        display: 'flex',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    div: {
        // height: 750,
        width: 450,
        marginTop: 100,
        paddingTop: 90,
        paddingBottom: 50,
        marginBottom: 50,
        borderColor: 'black',
    },
    input: {width: '70%'}
};

class registration extends Component {
    state = {
        firstName: '',
        lastName: '',
        email: '',
        dob: new Date(),
        gender: '1',
        profile_img: '',
        errors: {
            firstNameErr: '',
            lastNameErr: '',
            emailErr: '',
            dobErr: '',
            genderErr: '',
            profile_imgErr: '',
        },
        loading: false,
    };

    /**
     * Onchange event listner for all input's
     * @param {event,   type: which button.}
     */
    inputChange = async (event: any, inputType: any) => {
        await this.setState({[inputType]: event.target.value});
        const {firstName, lastName, email, profile_img} = this.state;
        const firstNameReg: any = /^[A-Za-z]+$/;
        const lastNameReg: any = /^[A-Za-z]+$/;
        // eslint-disable-next-line no-useless-escape
        const emailReg: any = /^[a-zA-Z]{1,}([.])?[a-zA-Z0-9]{1,}([!@#$%&_-]{1})?[a-zA-Z0-9]{1,}[@]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,3}([.]{1}[a-zA-Z]{2})?$/;
        const profile_imgReg: any = '';
        await this.setState((prevState: any) => {
            let errors = {...prevState.errors};
            if (inputType === 'firstName') {
                if (!firstNameReg.test(firstName)) { errors.firstNameErr = 'Only Aphabet is allowed.' }
                else { errors.firstNameErr = '' }
            }
            if (inputType === 'lastName') {
                if (!lastNameReg.test(lastName)) { errors.lastNameErr = 'Only Aphabet is allowed.' }
                else { errors.lastNameErr = '' }
            }
            if (inputType === 'email') {
                if (!emailReg.test(email)) { errors.emailErr = 'Invalid Email.' }
                else { errors.emailErr = '' }
            }
            if (inputType === 'profile_img') {
                if (!(profile_imgReg !== profile_img)) { errors.profile_imgErr = '  Upload image.' }
                else { errors.profile_imgErr = '' }
            }
            return {errors}
        })
    };

    //Onchange file input.
    fileChange = (event: any, type: any) => {
        this.setState({[type]: event.target.files[0]})
    };

    //reset api.
    registerapi = async () => {
        this.setState({loading: true});
        const {firstName, lastName, email, dob, gender, profile_img} = this.state;
        const firstNameReg: any = /^[A-Za-z]+$/;
        const lastNameReg: any = /^[A-Za-z]+$/;
        // eslint-disable-next-line no-useless-escape
        const emailReg: any = /^[a-zA-Z]{1,}([.])?[a-zA-Z0-9]{1,}([!@#$%&_-]{1})?[a-zA-Z0-9]{1,}[@]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,3}([.]{1}[a-zA-Z]{2})?$/;
        const dobReg: any = '';
        const genderReg: any = '';
        const profile_imgReg: any = '';

        await this.setState((prevState: any) => {
            let errors = {...prevState.errors};
            if (!firstNameReg.test(firstName)) { errors.firstNameErr = 'Only Aphabet is allowed.' }
            else { errors.firstNameErr = '' }

            if (!lastNameReg.test(lastName)) { errors.lastNameErr = 'Only Aphabet is allowed.' }
            else { errors.lastNameErr = '' }

            if (!emailReg.test(email)) { errors.emailErr = 'Invalid Email.' }
            else { errors.emailErr = '' }

            if (!(dobReg !== dob)) { errors.dobErr = 'Please Provide valid dob.' }
            else if (!(new Date(dob) < new Date())) { errors.dobErr = 'Date should be less than current date.' }
            else { errors.dobErr = '' }

            if (!(genderReg !== gender)) { errors.genderErr = 'Please select one.' }
            else { errors.genderErr = '' }

            if (!(profile_imgReg !== profile_img)) { errors.profile_imgErr = '  Upload image.' }
            else { errors.profile_imgErr = '' }
            return {errors}
        });

        if (firstNameReg.test(firstName) && lastNameReg.test(lastName) && emailReg.test(email) && (dobReg === this.state.errors.dobErr) && (genderReg === this.state.errors.genderErr) && (profile_imgReg === this.state.errors.profile_imgErr)) {
            const data = new FormData();
            data.append('firstName', firstName);
            data.append('lastName', lastName);
            data.append('email', email);
            data.append('dob', `${dob}`);
            data.append('gender', `${gender}`);
            data.append('profile_img', profile_img);
            try {
                let res = await withOutTokenPost('user', data, {headers: {'content-type': 'multipart/form-data'}});
                if (res.data.success) {
                    toastSuccess(res.data.message);
                    this.setState({loading: false});
                    //@ts-ignore
                    this.props.history.push('/login')
                } else {
                    this.setState({loading: false});
                    toastError("Something went wrong.")
                }
            } catch (err) {
                this.setState({loading: false});
                toastError(`${err.response.data.message}. please try again.`)
            }
        }
        this.setState({loading: false})
    };

    handleDateChange = (date: Date, prevState: any) => {
        this.setState({dob: date})
    };

    render() {
        return (
            <div style={customStyle.mainDiv}>
                {/*
                //@ts-ignore */}
                <Loader loading={this.state.loading}/>
                <Paper style={customStyle.div} variant='elevation'>
                    <h1>Registration.</h1>
                    <TextField
                        required
                        id=""
                        helperText={this.state.errors.firstNameErr}
                        //@ts-ignore
                        error={this.state.errors.firstNameErr}
                        label="First Name"
                        type="firstName"
                        autoComplete="firstName"
                        style={customStyle.input}
                        onChange={event => this.inputChange(event, 'firstName')}
                    />
                    <br/><br/>
                    <TextField
                        required
                        id=""
                        label="Last Name"
                        type="lastName"
                        helperText={this.state.errors.lastNameErr}
                        //@ts-ignore
                        error={this.state.errors.lastNameErr}
                        autoComplete=""
                        style={customStyle.input}
                        onChange={event => this.inputChange(event, 'lastName')}
                    />
                    <br/><br/>
                    <TextField
                        required
                        id="Email"
                        label="email"
                        type="email"
                        helperText={this.state.errors.emailErr}
                        //@ts-ignore
                        error={this.state.errors.emailErr}
                        // autoComplete=""
                        style={customStyle.input}
                        onChange={event => this.inputChange(event, 'email')}
                    />
                    <br/><br/>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                            minDate={'01/01/1990'}
                            style={{width: '70%'}}
                            margin="normal"
                            disableFuture={true}
                            InputProps={{disabled: true}}
                            id="date-picker-dialog"
                            label="Date of Birth *"
                            format="dd/MM/yyyy"
                            value={this.state.dob}
                            //@ts-ignore
                            onChange={this.handleDateChange}
                            KeyboardButtonProps={{ 'aria-label': 'change date' }}
                        />
                    </MuiPickersUtilsProvider>
                    <br/><br/>
                    <div style={{width: '70%', marginLeft: 'auto', marginRight: 'auto', textAlign: 'left'}}>
                        <FormLabel component="legend">Gender *</FormLabel>
                        <RadioGroup row style={{marginLeft: 'auto', marginRight: 'auto', alignItems: 'left'}}
                                    aria-label="gender" name="gender1" value={this.state.gender}
                                    onChange={event => this.inputChange(event, 'gender')}>
                            <FormControlLabel value="1" control={<Radio/>} label="Male"/>
                            <FormControlLabel value="0" control={<Radio/>} label="Female"/>
                            <FormControlLabel value="2" control={<Radio/>} label="Other"/>
                        </RadioGroup>
                    </div>
                    <FormLabel
                        style={{width: '70%', marginLeft: 'auto', marginRight: 'auto', textAlign: 'left'}}
                        component="legend"
                        color="secondary"
                    >Profile Image *</FormLabel>
                    <input
                        accept="image/*"
                        id="contained-button-file"
                        onChange={event => this.fileChange(event, 'profile_img')}
                        type="file"
                    />
                    <br/>
                    <div style={{width: '70%', marginLeft: 'auto', marginRight: 'auto', textAlign: 'left'}}>
                        <span style={{color: 'red'}}>{this.state.errors.profile_imgErr}</span>
                    </div>
                    <br/><br/>
                    <div style={{display: 'flex', justifyContent: 'center'}}>
                        <div style={{display: 'flex', width: '70%', justifyContent: 'space-around'}}>
                            <Button onClick={this.registerapi} variant="contained" color="primary">Registration</Button>
                        </div>
                    </div>
                </Paper>
            </div>
        )
    }
}


export default registration