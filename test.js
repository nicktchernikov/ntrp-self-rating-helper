const Test = () => {

    const handleButtonClick = (value) => {
        console.log('Clicked: ', value);
        console.log('Question answered: ', question);

        let rating = question[2];
        let endIfTrue = question[3];

        if (endIfTrue && value === true) {
            // endIfTrue is true for question
            
            setRating(rating);
            setMoreQuestions(false);
        } else {

            nextQuestion();
        }
    };

    const nextQuestion = () => {
        console.log('nextQuestion()');
        console.log('questionId: ', questionId);

        setQuestionId(questionId + 1);
    }

    const reset = () => {
        setQuestionId(0);
        setRating(null);
        setMoreQuestions(true);
        setQuestion([]);
    }
    
    const [questionId, setQuestionId] = React.useState(0);
    const [question, setQuestion] = React.useState([]);
    const [moreQuestions, setMoreQuestions] = React.useState(true);
    const [rating, setRating] = React.useState(null);

    React.useEffect(() => {

        console.log('useEffect()');

        fetch('questions.json')
            .then(response => response.json())
            .then(questions => {

                if (questionId <= questions.length - 1) {
                    // There are still more questions

                    let questionArr = [];
                    let questionObj = questions.find(question => question.id === questionId);
                    
                    console.log(questions);
    
                    Object.entries(questionObj).forEach(q => {
                        questionArr.push(q[1]);
                    });
    
                    setQuestion(questionArr);
                } else {
                    // No more questions

                    setMoreQuestions(false);
                }
 
            });

    }, [questionId, moreQuestions]);

    return (

        <div className='question__container'>

            {moreQuestions ? (
                <div>
                    <span className='question'> {question[1]} </span> 
                    <button onClick={() => handleButtonClick(true)}> True </button>
                    <button onClick={() => handleButtonClick(false)}> False </button>
                </div>
            ) : (
                <div>
                    <div className='rating'>Your rating: {rating}</div>
                    <button onClick={() => reset()}>Reset</button>
                </div>
            )
        }
        </div>
    );
}

const domContainer = document.querySelector('#root');
ReactDOM.render(<Test />, domContainer);