const RatingHelper = () => {
    const [allQuestions, setAllQuestions] = React.useState([]);
    const [typeIndex, setTypeIndex] = React.useState(0);

    const types = [
        'general', 
        'groundstrokes', 
        'net play', 
        'return of serve',
        'serve'
    ];

    const handleClick = () => {
        console.log('Click');
        setTypeIndex(typeIndex + 1);
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
                    value='question.id'
                    type='radio' 
                    className='question-radio' 
                />
                    {question.text}
            </label>
        );
    }

    React.useEffect(async () => {
        fetchAllQuestions().then((questionData) => setAllQuestions(questionData));
    }, []);

    const questions = filterQuestionsByType(allQuestions, types[typeIndex]);

    return (
        <div> 
            <div className='title'>Rating Helper</div>
            <hr />
            <div className='questions'>
                {questions.map(question => displayQuestion(question))}
            </div>
            <input type='button' value='Click' onClick= {() => handleClick()} />
        </div>
    );
}

ReactDOM.render(<RatingHelper />, document.querySelector('#root'));