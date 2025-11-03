import { useState } from 'react';

const WelcomeMenu = ({ setUserNameForHP }) => {
    const [userName, setUserName] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    const validateLogin = userName !== '' && userName.length < 20

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = () => {
        setIsFocused(false);
    };

    const handleValueChange = (e) => {
        setUserName(e.target.value);
    };

    const handleContinueClick = () => {
        if (validateLogin) {
            setUserNameForHP(userName); 
        }
        else {
            alert('The username must be between 1 and 20 characters long')
        }
    };

    return (
        <div className="h_page_overlay">
            <div className="h_page_container_for_welcome_menu">
                <div className="h_page_title_of_welcome_menu">Enter your username</div>
                <input
                    value={userName}
                    onChange={handleValueChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    placeholder={isFocused ? '' : 'Enter your name...'}
                    className="h_page_input_for_username"
                    type="text"
                />
                <button
                    onClick={handleContinueClick} 
                    className="h_page_button_of_welcome_menu"
                >
                    Continue
                </button>
            </div>
        </div>
    );
};

export default WelcomeMenu;
