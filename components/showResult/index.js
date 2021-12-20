const ShowResult = () => {
    const [fetching, setFetching] = React.useState(true);
    const [allQuestions, setAllQuestions] = React.useState([]);
    const [answers, setAnswers] = React.useState([]);
    const [ntrp, setNtrp] = React.useState('');
    const [name, setName] = React.useState('');
    const [date, setDate] = React.useState('');
 
    const baseUrl = 'https://precisiontennis.ca';
    const baseFolder = 'self-rating-helper';

    const fetchAllQuestions = async () => {
      return (await fetch(`/${baseFolder}/questions.json`)).json();
    }

    const filterQuestionsByType = (allQuestions, currentType) => {
      return allQuestions.filter(question => question.type.toLowerCase() === currentType.toLowerCase());
    }

    const getDescription = (type, rating) => {
      const defaultDescription = 'See General description';
      let description = defaultDescription;
      const typeQuestions = filterQuestionsByType(allQuestions, type);
      typeQuestions.forEach(question => {
        if (question.rating === rating) {
          description = question.text;
        }
      });
      if (description === 'None of the above apply to me; ask me more questions.') {
        description = '';
      }
      if (description !== defaultDescription) {
        description = '"' + description + '"';
      }
      if (description == '""') {
        description = 'See below descriptions';
      }
      return description;
    }
    
    const startOver = () => {
      window.location.href = `/${baseFolder}`;
    }

    React.useEffect(() => {
        const query = new URL(window.location.href);
        // const resultId = query.searchParams.get('id').trim();
	      const resultId = query.pathname.split('/')[2];
        fetch(`${baseUrl}/${baseFolder}/getResult.php?resultId=${resultId}`)
            .then(response => response.json())
            .then(data => {
                setAnswers(Object.entries(data.answers));
                setNtrp(data.ntrp);
                setName(data.name);
                setDate(data.date);
            });
          fetchAllQuestions().then((questionData) => setAllQuestions(questionData));
    }, []);

    React.useEffect(() => {
       if (answers.length > 0) {
           setFetching(false);
       }
    }, [answers]);

    return (
        <div> 
            {fetching === true ? (
                <div className=''> Loading... </div>
            ) : (
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
                        <div className='results'>
                            <table className='results-table'>
                                <caption className='rating'> Name: <code className='result-item'>{name}</code> <br />
                                <span className='rating-ntrp'> {( (ntrp.toString().indexOf('+') > -1) || (ntrp.toString().indexOf('-') > -1) ) ? ntrp : ntrp.toFixed(1)} NTRP</span> 
                                </caption>
                                <thead>
                                    <th>Stroke</th>
                                    <th>Self-Rating</th>
                                    <th>Description</th>
                                </thead>
                                <tbody>
                                {answers.map((answer, i) => {
                                    return (
                                        <tr key={i}>
                                            <td>
                                                {answer[0]}
                                            </td>
                                            <td>
                                                {answer[1] ? answer[1] : ( (ntrp.toString().indexOf('+') > -1) || (ntrp.toString().indexOf('-') > -1) ) ? ntrp : ntrp.toFixed(1)}
                                            </td>
                                            <td className='description'> 
                                             {getDescription(answer[0], answer[1])}
                                            </td>
                                        </tr>
                                    );
                                })}
                                </tbody>
                            </table>

                            <span style={{'marginBottom' : '10px' }}>Date of Rating:</span> <code className='result-item'>{date}</code>

                            <div className='pt-copy-link-header'> 
                                To share your rating, copy and paste this link: 
                            </div>
                            <input 
                                className='pt-copy-link' 
                                type='text'
                                value={window.location.href.split('?')[0]}
                                onClick={(e) => e.target.select()} 
                            />

                            <input id='start-over-button' className="start-over-button" type="button" value="Start Over" onClick={() => startOver()} />
                            <label className='pt-cta start-over-button' htmlFor='start-over-button'>
                                <span className='start-over-button-text'> Get Your Level! </span>
                            </label>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

ReactDOM.render(<ShowResult />, document.querySelector('#root'));