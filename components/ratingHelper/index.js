const RatingHelper = () => {

    const [allQuestions, setAllQuestions] = React.useState([]);
    const [typeIndex, setTypeIndex] = React.useState(0);
    const [selectedAnswer, setSelectedAnswer] = React.useState(null);
    const [answers, setAnswers] = React.useState([]);
    const [errorText, setErrorText] = React.useState(null);
    const [finalRating, setFinalRating] = React.useState(null);
    const [end, setEnd] = React.useState(false);
    const [endIfSelected, setEndIfSelected] = React.useState(false);
    const [nameInput, setNameInput] = React.useState('');
    const [nameComplete, setNameComplete] = React.useState(false);
    const [nameIsValid, setNameIsValid] = React.useState(false);

    const baseUrl = 'https://precisiontennis.ca'
    const baseFolder = 'rating';
    const resultBase = 'my-ntrp-rating';

    let types = [
        'general', 
        'groundstrokes', 
        'net play', 
        'return of serve',
        'serve'
    ];

    const saveToDatabase = (answers) => {
        const postData = new FormData();
        for (let i = 0; i < answers.length; i++) {
            let key = `rating-${types[i].replace(' ', '-')}`;
            postData.append(key, answers[i]);
        }
        postData.append('data-name', nameInput);
        postData.append('data-date', (new Date()).toDateString());

        fetch('saveResult.php', {
                method: 'POST',
                body: postData
            })
            .then(response => response.json())
            .then(data => {
                window.location.replace(`/${resultBase}/${data.resultId}`);
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
    
    const storeOrReplaceAnswer = () => {
        if (answers[typeIndex] === null) {
            storeAnswer();
        } else {
            replaceAnswer();
        }
    }

    const handleClickNextButton = () => {

        if(selectedAnswer !== null && selectedAnswer !== undefined) {
            if (endIfSelected) {
                if (selectedAnswer !== null) {
                    storeOrReplaceAnswer();
                }
                setEnd(true);
            } else {
                storeOrReplaceAnswer();
                setTypeIndex(typeIndex + 1);
            }
            setErrorText(null);
            if (answers[typeIndex+1] !== null) {
                setSelectedAnswer(answers[typeIndex+1]);
            }
            window.scrollTo(0, 0);
        } else {
            setErrorText('Please select an option.');
        }
    }

    const handleClickBackButton = () => {
        if (selectedAnswer !== null) {
            storeOrReplaceAnswer();
        }
        setErrorText(null);
        setTypeIndex(typeIndex - 1);

        if (answers[typeIndex-1] !== null) {
            setSelectedAnswer(answers[typeIndex-1]);
        }

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
            setErrorText(null);

            // Store results in MySQL database
            (types[typeIndex] === 'general' && endIfSelected) ? saveToDatabase([answers[0]]) : saveToDatabase(answers);
        } else {
            setErrorText('Please select an option.');
        }
    }

    const handleClickRadioButton = (question) => {
        if (!!question.endIfSelected === true) {
            setEndIfSelected(true);
        } else {
            setEndIfSelected(false);
        }
        setSelectedAnswer(question.rating);

        // window.scrollTo(0,document.body.scrollHeight);
        // setTimeout(() => {
        //     if (document.querySelectorAll('.pt-cta.next-button-label').length) {
        //         document.querySelector('.pt-cta.next-button-label').classList.add('pt-cta-active');
        //     } else if (document.querySelectorAll('.pt-cta.submit-button-label').length) {
        //         document.querySelector('.pt-cta.submit-button-label').classList.add('pt-cta-active');
        //     }
        // }, 250);

        // if (document.querySelectorAll('.nav').length) {
        //     document.querySelector('.nav').scrollIntoView();
        // }
    }

    const fetchAllQuestions = async () => {
        return (await fetch('./questions.json')).json();
    }
    
    const filterQuestionsByType = (allQuestions, currentType) => {
        return allQuestions.filter(question => question.type.toLowerCase() === currentType.toLowerCase());
    }

    const displayQuestion = (question) => {
        return (
            <div className='question'>
                <input
                    id={`question-id-${question.id}`}
                    name='question'
                    value={question.rating}
                    type='radio' 
                    className='question-radio'
                    onChange={() => handleClickRadioButton(question)}
                    checked={selectedAnswer === question.rating}
                />
                <label name='question' className='question-box' key={question.id} htmlFor={`question-id-${question.id}`}>
                    <span className='question-text' dangerouslySetInnerHTML={{ __html: question.text.trim() }} /> 
                    {question.endIfSelected && (
                        <div className='pt-question-label__container'>
                            <div className='pt-question-label'>
                                Selecting this option ends the helper
                            </div>
                        </div>
                    )}
                </label>
            </div>
        );
    }

    const displayQuestionList = () => {
        const questions = filterQuestionsByType(allQuestions, types[typeIndex]);
        return (
            <div>
                <div className='prompt-text'>
                    Please select the answer which best describes your skill level.
                </div>
                <div className='type'>
                    <span className='type-text'>{types[typeIndex]}</span>
                </div>

                <div className='questions'> 
                    {questions.map(question => displayQuestion(question))}
                </div>
                {errorText && (
                    <div className='error-text'>
                        {errorText}
                    </div>
                )}
                <div className='nav'>
                    {(typeIndex > 0 && typeIndex < types.length) && 

                        <label className='pt-cta back-button-label' htmlFor='back-button-input'>
                            <input id='back-button-input' className='back-button-input' type='button' value='Back' onClick={() => handleClickBackButton()} />
                            <span className='back-button-text'>Back</span>
                        </label>
                    }
                    {(typeIndex + 1 >= types.length) || endIfSelected ? (

                        <label className='pt-cta submit-button-label' htmlFor='submit-button-input'>
                            <input id='submit-button-input' className='submit-button-input' type='button' value='Submit' onClick= {() => handleClickSubmitButton()} />
                            <span className='submit-button-text'>Submit</span>
                        </label>

                    ) : (

                        <label className='pt-cta next-button-label' htmlFor='next-button-input'>
                            <input id='next-button-input' className='next-button-input' type='button' value='Next' onClick= {() => handleClickNextButton()} />
                            <span className='next-button-text'>Next</span>
                        </label>
                    )}
                </div>
            </div>
        )
    }

    const handleNameChange = (value) => {
        setNameInput(value);
    }

    const startHelper = () => {
        setNameComplete(true);
    }

    const displayNameForm = () => {
        return (
            <div className='name-form'>
                <div className='name-prompt'>What is your name? </div>
                <input 
                    type='text' 
                    className='name-input'
                    placeholder='Your Name'
                    onChange={(event) => handleNameChange(event.target.value)}
                    maxlength='30'
                />
                <br />
                <input
                    id='submit-name-button'
                    type='submit'
                    value='Start!'
                    onClick={() => startHelper()}
                    disabled={!nameIsValid}
                />
                <label htmlFor='submit-name-button'>
                    <div className='submit-name-button pt-cta'>
                        Start
                    </div>
                </label>
            </div>
        );
    }

    React.useEffect(() => {
        const listener = event => {
          if (event.code === "Enter" || event.code === "NumpadEnter") {
            event.preventDefault();
            if (document.querySelector('#submit-name-button').disabled === false) {
                startHelper();
            }
          }
        };
        document.addEventListener("keydown", listener);
        return () => {
          document.removeEventListener("keydown", listener);
        };
      }, []);

    React.useEffect(async () => {
        fetchAllQuestions().then((questionData) => setAllQuestions(questionData));

        if (document.querySelectorAll('.name-input').length) {
            document.querySelector('.name-input').focus();  
        }

    }, []);

    React.useEffect(() => {
    }, [selectedAnswer]);

    React.useEffect(() => {
    }, [answers]);

    React.useEffect(() => {
    }, [typeIndex]);

    React.useEffect(() => {
    }, [endIfSelected]);

    React.useEffect(() => {
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

    React.useEffect(() => {
        var alphaRegex = /^[-a-zA-Z ]*$/;
        if (nameInput.length > 0 && alphaRegex.test(nameInput)) {
            setNameIsValid(true);
        } else {
            setNameIsValid(false);
        }
    }, [nameInput]);

    React.useEffect(() => {
    }, [nameIsValid]);
       
    return (
        <div className='main'> 
            <div className='top-bar'>
                <a href={baseUrl + '/' + baseFolder} className='title'>NTRP Self-Rating Helper</a>
                <a href='/' className='brand'>
                    <div className='brand-intro-text'>by</div>
                    <img className='brand-logo' src='https://precisiontennis.ca/assets/img/pt_logo.png' />
                    <div className='brand-text'>
                        PRECISION TENNIS
                    </div>
                </a>
            </div>
            <div className='content'>
                {nameComplete ? displayQuestionList() : displayNameForm()}
            </div>
        </div>
    );
}

ReactDOM.render(<RatingHelper />, document.querySelector('#root'));