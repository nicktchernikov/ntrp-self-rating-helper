const RatingHelper = () => {
    const [allQuestions, setAllQuestions] = React.useState([]);
    const [typeIndex, setTypeIndex] = React.useState(0);
    const [selectedAnswer, setSelectedAnswer] = React.useState(null);
    const [answers, setAnswers] = React.useState([]);
    const [errorText, setErrorText] = React.useState(null);
    const [finalRating, setFinalRating] = React.useState(null);
    const [end, setEnd] = React.useState(false);
    const [endIfSelected, setEndIfSelected] = React.useState(false);

    let types = [
        'general', 
        'groundstrokes', 
        'net play', 
        'return of serve',
        'serve'
    ];

    const postToMongo = (answers) => {
        const postData = new FormData();
        for (let i = 0; i < answers.length; i++) {
            postData.append(i, answers[i]);
        }
        fetch('addResult.php', {
            method: 'POST',
            body: postData
        })
        .then(data => data.json())
        .then(res => {
            console.log('POST Request complete, resultId: ', res.resultId);
            window.location.replace(
                `/result.php?id=${res.resultId}`
            )
        });
    }

    const storeAnswer = () => {
        setAnswers([...answers, selectedAnswer]);
        setErrorText(null);
    }

    const replaceAnswer = () => {
        answers[typeIndex] = selectedAnswer;
        setAnswers(answers);  
    }

    const handleClickNextButton = () => {
        console.log('Clicked next!');
        if(selectedAnswer !== undefined) {
            if (endIfSelected) {
                if (selectedAnswer !== null) {
                    if (answers[typeIndex] === null) {
                        storeAnswer();
                    } else {
                        replaceAnswer();
                    }
                }
                setEnd(true);
            } else {
                if (answers[typeIndex] === null) {
                    storeAnswer();
                } else {
                    replaceAnswer();
                }
                setTypeIndex(typeIndex + 1);
                console.log('answers in handleClickNextButton()', answers);
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
                storeAnswer();
            } else {
                replaceAnswer();
            }
        }
        console.log('answers in handleClickBackButton()', answers);

        setTypeIndex(typeIndex - 1);
    }

    const handleClickSubmitButton = () => {
        if (selectedAnswer !== null) {
            if (answers[typeIndex] === null) { // answer already selected before
                storeAnswer();
            } else {
                answers[typeIndex] = selectedAnswer; // replace with new selection
                // to handle general type questions being changed from None to something that ends the helper:
                (types[typeIndex] === 'general' && endIfSelected) ? setAnswers([selectedAnswer]) : setAnswers(answers);
            }
            setEnd(true); 
        }

        // Store results in MySQL database
        (types[typeIndex] === 'general' && endIfSelected) ? postToMongo([answers[0]]) : postToMongo(answers);
    }

    const handleClickRadioButton = (question) => {
        console.log('Clicked radio button!');
        console.log('question.endIfSelected in handleClickRadioButton()', question.endIfSelected);
        if (!!question.endIfSelected === true) {
            setEndIfSelected(true);
        } else {
            setEndIfSelected(false);
        }
        setSelectedAnswer(question.rating);
        console.log('answers state in handleClickRadioButton()', answers);
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
            <div className='prompt-text'>
                Please select the answer which best describes your skill level.
            </div>
            <div className='type'>
               <span className='type-text'>{types[typeIndex]} Statements</span>
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
            {(typeIndex + 1 >= types.length) || endIfSelected ? (
                <input className='submit-button' type='button' value='Submit' onClick= {() => handleClickSubmitButton()} />
            ) : (
                <input className='next-button' type='button' value='Next' onClick= {() => handleClickNextButton()} />
            )}
        </div>)
    }

    const startOver = () => {
        location.reload();
    }

    const getText = (answer, type) => {
        console.log('-----'); 
        console.log('answer in getText()', answer);
        console.log('type in getText()', type);
        console.log('-----'); 

        const question = allQuestions.find(question => question.rating === answer && question.type.toLowerCase() === type); 
        return question.text;
    }

    const displayResults = (generalOnly) => {
        console.log('types in displayResults()', types);
        console.log('answers in displayResults()', answers);
        return (
            <div className='results'>
                <div className='final-rating'> Your rating is <b>{finalRating} NTRP</b></div>
  
                <table className='answers-summary'>
                    <caption className='answers-summary-title'>
                        Your Responses
                    </caption>
                    <tbody>
                        <tr className='summary-item'>
                            <td colSpan="1" className='summary-item-category'>
                                Category
                            </td>
                            <td colSpan="1" className='summary-item-text'>
                                Text
                            </td>
                            <td colSpan="1" className='summary-item-rating'>
                                Rating
                            </td>
                        </tr>
                        {answers.map((answer, i) => {
                            if (!generalOnly && i > 0) {
                                return (
                                    <tr className='summary-item' key={i}>
                                        <td colSpan="1" className='summary-item-category'>
                                            {types[i]}
                                        </td>
                                        <td colSpan="1" className='summary-item-text' dangerouslySetInnerHTML={{ __html: getText(answer, types[i]) }} />
                                        <td colSpan="1" className='summary-item-rating'>
                                            {answer}
                                        </td>
                                    </tr>
                                    )
                                } else { 
                                    if (generalOnly) {
                                        return (
                                            <tr className='summary-item' key={i}>
                                                <td colSpan="1" className='summary-item-category'>
                                                    General
                                                </td>
                                                <td colSpan="1" className='summary-item-text' dangerouslySetInnerHTML={{ __html: getText(answer, 'general') }} />
                                                <td colSpan="1" className='summary-item-rating'>
                                                    {answer}
                                                </td>
                                            </tr>  
                                        )
                                    }
                                }
                        })}
                    </tbody>
                </table>
                <input className="start-over-button" type="button" value="Start Over" onClick={() => startOver()} />
            </div>
        );
    }

    React.useEffect(async () => {
        fetchAllQuestions().then((questionData) => setAllQuestions(questionData));
    }, []);

    React.useEffect(() => {
        console.log('selectedAnswer state in useEffect() for selectedAnswer', selectedAnswer);
    }, [selectedAnswer]);

    React.useEffect(() => {
        console.log('answers state in useEffect() for answers', answers);
    }, [answers]);

    React.useEffect(() => {
        setSelectedAnswer(answers[typeIndex]);
    }, [typeIndex]);

    React.useEffect(() => {
        console.log('endIfSelected state in useEffect() for endIfSelected', endIfSelected);
    }, [endIfSelected]);

    React.useEffect(() => {
        console.log('answers state in useEffect() for end', answers);
        if (endIfSelected === true) {
            setFinalRating(selectedAnswer);
        } else {
            let answersCopy = [...answers];
            let total = 0.0;
            answersCopy.shift(); // remove 1st element from array
            answersCopy.map((answer) => {
                total += parseFloat(answer);
            });
            const averageRating = (total / answersCopy.length);
            setFinalRating(averageRating.toFixed(1));
        }
    }, [end]);
       
    return (
        <div> 
            <div className='title'>NTRP Self-Rating Helper</div>
            <hr />
            {displayQuestionList()}
        </div>
    );
}

ReactDOM.render(<RatingHelper />, document.querySelector('#root'));