import React from 'react';
import styles from './Home.module.css';
import { Link, useHistory } from 'react-router-dom';
import Card from '../../components/shared/Card/Card';
import Button from '../../components/shared/Button/Button';

const Home = () => {
    const signInLinkStyle = {
        color: '#0077ff',
        fontWeight: 'bold',
        textDecoration: 'none',
        marginLeft: '10px',
    };
    const history = useHistory();
    function startRegister() {
        history.push('/authenticate');
    }
    return (
        <div className={styles.cardWrapper}>
            <Card title="Welcome to Our App" icon="logo">
                <p className={styles.text}>
                </p>
                <div>
                    <Button onClick={startRegister} text="Let's Go" />
                </div>
            </Card>
        </div>
    );
};

export default Home;
