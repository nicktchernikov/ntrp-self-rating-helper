const ShowResult = () => {
    
    const [answers, setAnswers] = React.useState([]);
    const [ntrp, setNtrp] = React.useState('');
    const [fetching, setFetching] = React.useState(true);
 
    const startOver = () => {
        window.location.href = '/';
    }

    React.useEffect(() => {
        const query = new URL(window.location.href);
        const resultId = query.searchParams.get('id').trim();
        fetch(`/getResult.php?resultId=${resultId}`)
            .then(response => response.json())
            .then(data => {
                setAnswers(Object.entries(data.answers));
                setNtrp(data.ntrp);
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
                <div> Loading...</div>
            ) : (
                <div>
                    <div className='title'>NTRP Self-Rating Helper</div>
                    <hr />
                    <table border='1'>
                        <caption> Your Rating is {ntrp} </caption>
                        {answers.map((answer, i) => {
                            return (
                                <tr key={i}>
                                    <td>
                                        {answer[0]}
                                    </td>
                                    <td>
                                        {answer[1]}
                                    </td>
                                </tr>
                            );
                        })}
                    </table>
                    <input className="start-over-button" type="button" value="Start Over" onClick={() => startOver()} />
                </div>
            )}
        </div>
    );
}

ReactDOM.render(<ShowResult />, document.querySelector('#root'));