/* Better plan: 
    Fetch questions once onload
    Filter questions every type typeIndex changes
*/

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

let questions = [];

const currentScreen = 'General';

const fetchAllQuestions = async () => {
    return (await fetch('./questions.json')).json();
}

const fetchQuestionsOfType = async (type) => {
    let questions = await fetchAllQuestions();
    const questionsOfType = questions.filter(q => q.type.toLowerCase() === type.toLowerCase());
    return await questionsOfType;
}

const TestV2 = () => {
    const [typeIndex, setTypeIndex] = React.useState(0);
    const [questionsOfType, setQuestionsOfType] = React.useState([]);

    const handleButtonClick = () => {
        console.log('>>>> In handleButtonClick');
        setTypeIndex(typeIndex + 1);
    }

    // React.useEffect(async () => {
    //    questions = await fetchAllQuestions();
    // }, []);

    React.useEffect(async () => { // when typeIndex changes
        console.log('>>>> in typeIndex useEffect');
        console.log('>>>> typeIndex', typeIndex);
        console.log('>>>> types[typeIndex]', types[typeIndex]);
        fetchQuestionsOfType(types[typeIndex]).then((data) => {
            console.log('>>>> data', data);
            setQuestionsOfType(data);
        });
    }, [typeIndex]);

    return(
        <div>
            {currentScreen === 'General' &&
                <div>
                    
                    <input onClick={() => handleButtonClick()} type='button'
                    value='Click' />

                </div>
            }
        </div>
    );
}

// Render the main component
ReactDOM.render(<TestV2 />, document.querySelector('#root'));