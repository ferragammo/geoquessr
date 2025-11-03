const RadioButton = ({ id, text, className, classNameForText, isSelected, onChange, name }) => {
    return (
        <label className={className}>
            <input
                type="radio"
                name={name} 
                id={id}
                checked={isSelected} 
                onChange={() => onChange(text)}
            />
            <span className={classNameForText}>{text}</span>
        </label>
    );
};

export default RadioButton;
