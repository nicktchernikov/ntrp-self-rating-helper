const RatingHelper = () => {
    const [allQuestions, setAllQuestions] = React.useState([]);
    const [typeIndex, setTypeIndex] = React.useState(0);
    const [selectedAnswer, setSelectedAnswer] = React.useState(null);
    const [answers, setAnswers] = React.useState([]);
    const [errorText, setErrorText] = React.useState(null);
    const [finalRating, setFinalRating] = React.useState(null);
    const [end, setEnd] = React.useState(false);
    const [endIfSelected, setEndIfSelected] = React.useState(false);

    const types = [
        'general', 
        'groundstrokes', 
        'net play', 
        'return of serve',
        'serve'
    ];

    const handleClickNextButton = () => {
        console.log('Clicked next!');
        if(selectedAnswer !== undefined) {
            if (endIfSelected) {
                if (selectedAnswer !== null) {
                    if (answers[typeIndex] === null) {
                        setAnswers([...answers, selectedAnswer]);
                        setErrorText(null);
                    } else {
                        answers[typeIndex] = selectedAnswer;
                        setAnswers(answers);
                    }
                }
                setEnd(true);
            } else {
                if (answers[typeIndex] === null) {
                    setAnswers([...answers, selectedAnswer]);
                    setErrorText(null);
                } else {
                    answers[typeIndex] = selectedAnswer;
                    setAnswers(answers);
                }
                setTypeIndex(typeIndex + 1);
                console.log('answers', answers);
            }
            setErrorText(null);
        } else {
            setErrorText('Please select an option above.');
            console.log('Displaying error message.');
        }
    }

    const handleClickBackButton = () => {
        console.log('Clicked back!');
        if (selectedAnswer !== null) {
            if (answers[typeIndex] === null) {
                setAnswers([...answers, selectedAnswer]);
                setErrorText(null);
            } else {
                answers[typeIndex] = selectedAnswer;
                setAnswers(answers);
            }
        }
        console.log('answers', answers);

        setTypeIndex(typeIndex - 1);
    }

    const handleClickSubmitButton = () => {
        if (selectedAnswer !== null) {
            if (answers[typeIndex] === null) {
                setAnswers([...answers, selectedAnswer]);
                setErrorText(null);
            } else {
                answers[typeIndex] = selectedAnswer;
                setAnswers(answers);
            }
            setEnd(true); 
        }
    }

    const handleClickRadioButton = (question) => {
        console.log('Clicked radio button!');
        console.log('question.endIfSelected', question.endIfSelected);
        if (!!question.endIfSelected === true) {
            setEndIfSelected(true);
        } else {
            setEndIfSelected(false);
        }
        setSelectedAnswer(question.rating);
    }

    const fetchAllQuestions = async () => {
        return (await fetch('./questions.json')).json();
    }
    
    const filterQuestionsByType = (allQuestions, currentType) => {
        return allQuestions.filter(question => question.type.toLowerCase() === currentType.toLowerCase());
    }

    const displayQuestion = (question) => {
        return (
            <label className='question-box' key={question.id} htmlFor={question.id}>
                <input
                    id={question.id}
                    name='question'
                    value={question.rating}
                    type='radio' 
                    className='question-radio'
                    onClick={() => handleClickRadioButton(question)}
                    defaultChecked={answers[typeIndex] === question.rating}
                />
                <span className='question-text' dangerouslySetInnerHTML={{ __html: question.text }} />    
            </label>
        );
    }

    const displayQuestionList = () => {
        const questions = filterQuestionsByType(allQuestions, types[typeIndex]);
        return (<div> 
            <div className='type'>
                {types[typeIndex]} Questions
            </div>
            <div className='prompt-text'>
                Please select the answer which best describes your skill level.
            </div>
            <div className='questions'> 
                {questions.map(question => displayQuestion(question))}
            </div>
            <div className='error-text'>
                {errorText}
            </div>
            {(typeIndex > 0 && typeIndex < types.length) && 
                <input className='back-button' type='button' value='Back' onClick={() => handleClickBackButton()} />
            }
            {(typeIndex + 1 >= types.length) ? (
                <input className='submit-button' type='button' value='Submit' onClick= {() => handleClickSubmitButton()} />
            ) : (
                <input className='next-button' type='button' value='Next' onClick= {() => handleClickNextButton()} />
            )}
        </div>)
    }

    const startOver = () => {
        location.reload();
    }

    const displayResults = () => {
        return (
            <div className='results'>
                <div className='final-rating'> Your rating is {finalRating} NTRP </div>
                <input className="start-over-button" type="button" value="Start Over" onClick={() => startOver()} />
            </div>
        );
    }

    React.useEffect(async () => {
        fetchAllQuestions().then((questionData) => setAllQuestions(questionData));
    }, []);

    React.useEffect(() => {
        console.log('selectedAnswer', selectedAnswer);
    }, [selectedAnswer]);

    React.useEffect(() => {
        console.log('answers', answers);
    }, [answers]);

    React.useEffect(() => {
        setSelectedAnswer(answers[typeIndex]);
    }, [typeIndex]);

    React.useEffect(() => {
        console.log('endIfSelected', endIfSelected);
    }, [endIfSelected]);

    React.useEffect(() => {
        console.log('useEffect() for end state');
        console.log(answers);
        if (endIfSelected) {
            setFinalRating(selectedAnswer);
        } else {
            answers.shift();
            let total = 0.0;
            answers.map((answer) => {
                console.log(answer);
                total += parseFloat(answer);
            });
            const averageRating = (total / answers.length);
            setFinalRating(averageRating.toFixed(1));
        }
    }, [end]);
       
    return (
        <div> 
            <div className='title'>NTRP Self-Rating Helper</div>
            <hr />
            {(end) ? displayResults() : displayQuestionList()}
        </div>
    );
}

ReactDOM.render(<RatingHelper />, document.querySelector('#root'));