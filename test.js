/* To do:

* Stop asking questions about the type of stroke after a user selects false
* Store ratings for each type of stroke
* Calculate overall total

*/ 

const answers = {
    'general' : [],
    'groundstrokes' : [],
    'return of serve' : [],
    'net play' : [],
    'serve' : []
};

const typesCompleted = {
    'general' : false,
    'groundstrokes' : false,
    'return of serve' : false,
    'net play' : false,
    'serve' : false
}

const ratings = {
    'general' : 1.0,
    'groundstrokes' : 1.0,
    'return of serve' : 1.0,
    'net play' : 1.0,
    'serve' : 1.0,
    'overall' : 1.0
}

async function fetchQuestions() {
    const response = await fetch('./questions.json');
    const questions = await response.json();
    return questions;
}

const Test = () => {

    const handleButtonClick = (value) => {
        console.log('User answered: ', value);
        console.log('... to current question: ', question);

        let rating = question[2];
        let endIfTrue = question[3];
        let type = question[4];

        if (endIfTrue && value === true) {
            // End quiz if endIfTrue is true for question, and if answer is true
            
            setRating(rating);
            setMoreQuestions(false);

        } else {
            storeAnswer(question, value);
            nextQuestion();
        }
    };

    const nextQuestion = () => {
        console.log('---');
        console.log('nextQuestion()');
        console.log('questionId: ', questionId);

        setQuestionId(questionId + 1);
    }

    const reset = () => {
        setQuestionId(0);
        setRating(null);
        setMoreQuestions(true);
        setQuestion([]);
        localStorage.removeItem('answers');
    }

    const storeAnswer = (question, value) => {

        if( question[4] !== 'general' && value === false) {
            console.log(`Adding removal of questions of type ${question[4]}`);
            typesCompleted[questions[4]] = true;
        }

        let type = question[4];
        let answer = {
            'id' : question[0], 
            'rating' : question[2], 
            'value' : value
        };
        answers[type].push(answer);
        ratings[type] = question[2];

        localStorage.setItem('answers', JSON.stringify(answers));
    }
    
    const [questionId, setQuestionId] = React.useState(0);
    const [question, setQuestion] = React.useState([]);
    const [moreQuestions, setMoreQuestions] = React.useState(true);
    const [rating, setRating] = React.useState(null);

    React.useEffect(() => {

        console.log('useEffect() ran');

        fetch('questions.json')
            .then(response => response.json())
            .then(questions => {

                if (questionId <= questions.length - 1) {
                    // There are still more questions

                    let questionArr = [];
                    let questionObj = questions.find(question => question.id === questionId);
                    
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

        {
            moreQuestions ? (
                <div>
                    <div className='type'> {question[4]} </div>
                    <span className='question'> {question[1]} </span> 
                    <button onClick={() => handleButtonClick(true)}> True </button>
                    <button onClick={() => handleButtonClick(false)}> False </button>
                    <button onClick={() => reset()}>Reset</button>
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