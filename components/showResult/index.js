const ShowResult = () => {
    const [answers, setAnswers] = React.useState([]);
    const [ntrp, setNtrp] = React.useState('');
    const [fetching, setFetching] = React.useState(true);
    const [name, setName] = React.useState('');
    const [date, setDate] = React.useState('');
 
    const startOver = () => {
        window.location.href = '/';
    }

    React.useEffect(() => {
        const query = new URL(window.location.href);
        const resultId = query.searchParams.get('id').trim();
        fetch(`/getResult.php?resultId=${resultId}`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setAnswers(Object.entries(data.answers));
                setNtrp(data.ntrp);
                setName(data.name);
                setDate(data.date);
            });
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
                        <a href='/' className='title'>NTRP Self-Rating Helper</a>
                        <div className='brand'>
                            <div className='brand-intro-text'>by</div>
                            <img className='brand-logo' src='https://precisiontennis.ca/assets/img/pt_logo.png' />
                            <div className='brand-text'>
                                PRECISION TENNIS
                            </div>
                        </div>
                    </div>
                    <div className='content'>
                        <div className='results'>
                            <table className='results-table'>
                                <caption className='rating'> Name: <code class='result-item'>{name}</code> <br />
                                <span className='rating-ntrp'> {(ntrp.toString().indexOf('+') ? ntrp : ntrp.toFixed(1))} NTRP</span> 
                                </caption>
                                <thead>
                                    <th>Stroke</th>
                                    <th>Self-Rating</th>
                                </thead>
                                <tbody>
                                {answers.map((answer, i) => {
                                    return (
                                        <tr key={i}>
                                            <td>
                                                {answer[0]}
                                            </td>
                                            <td>
                                                {answer[1] ? answer[1] : (ntrp.toString().indexOf('+') || ntrp.indexOf('-') ? ntrp : ntrp.toFixed(1))}
                                            </td>
                                        </tr>
                                    );
                                })}
                                </tbody>
                            </table>
                            <span style={{'marginBottom' : '10px' }}>Date of Rating:</span> <code class='result-item'>{date}</code>
                            {/* <input id='start-over-button' className="start-over-button" type="button" value="Start Over" onClick={() => startOver()} />
                            <label className='start-over-button' htmlFor='start-over-button'>
                                <span className='start-over-button-text'> Start Over </span>
                            </label> */}
                        </div>
                    </div>
                </div>


            )}
        </div>
    );
}

ReactDOM.render(<ShowResult />, document.querySelector('#root'));