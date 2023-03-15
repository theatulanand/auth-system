import React, { useState } from 'react';
import Card from '../../../components/shared/Card/Card';
import Button from '../../../components/shared/Button/Button';
import TextInput from '../../../components/shared/TextInput/TextInput';
import { useDispatch, useSelector } from 'react-redux';
import { setName } from '../../../store/activateSlice';
import styles from './StepName.module.css';
import { useAlert } from 'react-alert'
const StepName = ({ onNext }) => {
    const { name } = useSelector((state) => state.activate);
    const dispatch = useDispatch();
    const [fullname, setFullname] = useState(name);
    const alert = useAlert()

    function nextStep() {
        if (!fullname) {
            return alert.show(<div style={{ color: 'red' }}>Enter Full Name</div>)
        }
        dispatch(setName(fullname));
        onNext();
    }
    return (
        <>
            <Card title="What’s your full name?" icon="goggle-emoji">
                <TextInput
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                />
                <p className={styles.paragraph}>
                    Use Real Name :) !
                </p>
                <div>
                    <Button onClick={nextStep} text="Next" />
                </div>
            </Card>
        </>
    );
};

export default StepName;
