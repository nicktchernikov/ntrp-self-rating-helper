const categoryAnswers = {
    'groundstrokes' : [],
    'return of serve' : [],
    'net play' : [],
    'serve' : []
};

const types = [
    'general', 
    'groundstrokes', 
    'net play', 
    'return of serve',
    'serve'
];

const currentScreen = 'General';

const fetchQuestions = async () => {
    const response = await fetch('./questions.json');
    const questions = await response.json();
    return questions;
}

const fetchQuestionsOfType = async (type) => {
    const questions = await fetchQuestions();
    const questionsOfType = questions.filter(q => q.type === type);
    console.log(questionsOfType);
}

const TestV2 = () => {

    const [typeIndex, setTypeIndex] = React.useState(0);
    const [currentType, setCurrentType] = React.useState(types[typeIndex]);

    const handleButtonClick = () => {
        setTypeIndex(typeIndex + 1);
        setCurrentType(types[typeIndex]);
    }

    React.useEffect(() => {
        console.log('>>>> In useEffect()');
        const questionsOfType = fetchQuestionsOfType(currentType);
        console.log(questionsOfType);
    }, []);

    return(
        <div>
            {currentScreen === 'General' &&
                <div>
                    
                    <input onClick={() => handleButtonClick()} type='button' />

                </div>
            }
        </div>
    );
}

// Render the main component
ReactDOM.render(<TestV2 />, document.querySelector('#root'));