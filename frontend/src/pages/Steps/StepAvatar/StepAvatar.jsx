import React, { useState } from 'react';
import Card from '../../../components/shared/Card/Card';
import Button from '../../../components/shared/Button/Button';
import styles from './StepAvatar.module.css';
import { useSelector, useDispatch } from 'react-redux';
import { setAvatar } from '../../../store/activateSlice';
import { activate } from '../../../http';
import { setAuth } from '../../../store/authSlice';
import Loader from '../../../components/shared/Loader/Loader';
import { useAlert } from 'react-alert'

const StepAvatar = ({ onNext }) => {
    const dispatch = useDispatch();
    const { name, avatar } = useSelector((state) => state.activate);
    const [image, setImage] = useState('/images/monkey-avatar.png');
    const [loading, setLoading] = useState(false);
    const alert = useAlert()
    function captureImage(e) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = function () {
            setImage(reader.result);
            dispatch(setAvatar(reader.result));
        };
    }
    async function submit() {
        if (!avatar) {
            alert.show(<div style={{ color: 'red' }}>Choose Avatar From Local Device</div>)
        }
        setLoading(true)
        try {
            const { data } = await activate({ name, avatar });
            if (data.auth) {
                dispatch(setAuth(data));
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return <Loader message="Activation In Progress" />;
    }
    return (
        <>
            <Card title={`Okay, ${name}`} icon="monkey-emoji">
                <div className={styles.avatarWrapper}>
                    <img
                        className={styles.avatarImage}
                        src={image}
                        alt="avatar"
                    />
                </div>
                <div>
                    <input
                        onChange={captureImage}
                        id="avatarInput"
                        type="file"
                        className={styles.avatarInput}
                    />
                    <label className={styles.avatarLabel} htmlFor="avatarInput">
                        Choose Avatar
                    </label>
                </div>
                <div>
                    <Button onClick={submit} text="Next" />
                </div>
            </Card>
        </>
    );
};

export default StepAvatar;
