import '../../../scss/sectionContent/neuralNetworks.scss';
import { useEffect, useRef, useState } from 'react';
import * as Brain from 'brain.js/dist/brain-browser.js';

export default function NeuralNetworks({type, title}) {
    const neuralNet = useRef();
    const lstmNet = useRef();
    const [brainOutput, setBrainOutput] = useState([]);
    const [neuralNetTrained, setNeuralNetTrained] = useState(false);
    const playerChoices = useRef(['rock', 'paper', 'scissors']);
    const lstmTrainingData = useRef([['rock', 'paper', 'scissors', 'rock']]);
    const didPredict = useRef();

    const brainOutputEl = useRef();

    const [score, setScore] = useState({
        outcome: '---',
        playerScore: 0,
        AIScore: 0,
        playerChoice: '---',
        AIChoice: '---',
    });
    const scoreTimeoutSignature = useRef();

    // Initialise Neural Networks
    useEffect(() => {
        neuralNet.current = new Brain.NeuralNetwork({
            hiddenLayers: [3]
        });
        lstmNet.current = new Brain.recurrent.LSTM();
    }, []);

    // NeuralNetwork trained once, LSTMNet takes over
    useEffect(() => {
        if (!neuralNetTrained) return;

        trainLSTMNet();
    }, [neuralNetTrained]);

    // Brain output area when updated, scroll to bottom to follow the text
    useEffect(() => {
        scrollBrainOutputToBottom();
    }, [brainOutput]);

    const trainNeuralNet = (e) => {
        const neuralNetData = [
            { input: { rock: 1 }, output: { paper: 1 } },
            { input: { paper: 1 }, output: { scissors: 1 } },
            { input: { scissors: 1 }, output: { rock: 1 } },
        ];
        updateBrainOutput('// Training data:');
        updateBrainOutput({ input: { rock: 1 }, output: { paper: 1 } });
        updateBrainOutput({ input: { paper: 1 }, output: { scissors: 1 } });
        updateBrainOutput({ input: { scissors: 1 }, output: { rock: 1 } });
        const trainResult = neuralNet.current.train(neuralNetData, {
            iterations: 2000,
            errorThresh: 0.005,
        });
        updateBrainOutput('// Learned "Rock, Paper, Scissors":');
        updateBrainOutput(trainResult);
        const runResult = neuralNet.current.run({ rock: 1 });
        updateBrainOutput('// Given "rock", my return probability is:');
        updateBrainOutput(runResult);
        updateBrainOutput("// Player learning settings:");
        updateBrainOutput({ iterations: 200, errorThresh: 0.025, maxPatterns: 13 });
        updateBrainOutput("// Let's play!");

        setNeuralNetTrained(true);
    }

    const trainLSTMNet = () => {
        lstmNet.current.train(lstmTrainingData.current, {
            iterations: 200,
            errorThresh: 0.025,
        });
        const result = lstmNet.current.run(playerChoices.current);
        didPredict.current = result;
    }

    const updateBrainOutput = (item) => setBrainOutput(state => [...state, item]);

    const scrollBrainOutputToBottom = () => brainOutputEl.current.scrollTo(0, brainOutputEl.current.scrollHeight);

    const AIPredictOutcome = (prediction) => {
        const weights = neuralNet.current.run({ [prediction]: 1 });
        return Object.keys(weights).reduce((a, b) => weights[a] > weights[b] ? a : b);
    }

    const PlayerChose = (id) => {
        // Predict what player will choose based on previous choices
        const AIid = recorrectPrediction(didPredict.current);
        const AIChoice = AIPredictOutcome(AIid);
        updateBrainOutput(`// I choose: "${AIChoice}"`);
        updateBrainOutput(`// Predicted you would use: "${AIid}"`);

        // Update score
        updateScore(id, AIChoice);

        // Train based on what the player chose
        const runData = playerChoices.current.slice(1);
        runData.push(id);
        playerChoices.current = runData;
        const data = lstmTrainingData.current[lstmTrainingData.current.length - 1].slice(1);
        data.push(id);
        if (lstmTrainingData.current.length === 13) {
            lstmTrainingData.current.shift();
        }
        lstmTrainingData.current = [...lstmTrainingData.current, data];
        trainLSTMNet();
    }

    const recorrectPrediction = (input) => {
        let res = 'rock';
        if (!input) {
            return res;
        } else if (input.includes('rock')) {
            res = 'rock';
        } else if (input.includes('paper')) {
            res = 'paper';
        } else if (input.includes('scissors')) {
            res = 'scissors';
        }
        return res;
    }

    const updateScore = (playerChoice, AIChoice) => {
        // outcome = -1 = lost, outcome = 0 = draw, outcome = 1 = won
        let outcome = 0;
        if (playerChoice === 'rock' && AIChoice === 'scissors') {
            outcome = 1;
        } else if (playerChoice === 'paper' && AIChoice === 'rock') {
            outcome = 1;
        } else if (playerChoice === 'scissors' && AIChoice === 'paper') {
            outcome = 1;
        } else if (playerChoice === AIChoice) {
            outcome = 0;
        } else {
            outcome = -1;
        }
        outcome = outcome === 1 ? 'you won!' : outcome === -1 ? 'you lost!' : 'draw!';
        setScore({
            outcome: outcome.toUpperCase(),
            playerScore: outcome === 'you won!' ? score.playerScore + 1 : score.playerScore,
            AIScore: outcome === 'you lost!' ? score.AIScore + 1 : score.AIScore,
            playerChoice: playerChoice.toUpperCase(),
            AIChoice: AIChoice.toUpperCase(),
            selfInvoked: false
        });

        // Score board timeout
        clearTimeout(scoreTimeoutSignature.current);
        scoreTimeoutSignature.current = setTimeout(() => {
            setScore({
                outcome: '---',
                playerScore: outcome === 'you won!' ? score.playerScore + 1 : score.playerScore,
                AIScore: outcome === 'you lost!' ? score.AIScore + 1 : score.AIScore,
                playerChoice: '---',
                AIChoice: '---',
            });
        }, 1500);
    }

    return (
        <>
        <script src="//unpkg.com/brain.js"></script>
        <div className='header'>
            <div className={'indicator' + ' indicator--' + type}></div>
            <h1 className='title'>{title}</h1>
        </div>
        <div className='body'>
            <p>Neural Networks is something that I've always wanted to get into, especially because it's perfect for creating realistic AI in games - typically as gamers we've been subject to 'static' NPCs that will follow state based on RNG. Nodes in a Neural Network <i>start off</i> assosiated with random values, but quickly learn rules/patterns over time, and can result in varied behaviour and decisions.</p>
            <p>Using <a href={'//brain.js.org/#/'} target='_blank' rel='noopener noreferrer'>brain.js</a>, let's teach our Neural Network the rules of a very simple game - Rock, Paper, Scissors. Not only that, but by feeding in the decisions of the player, we can build up a larger training set over time, and the Neural Network will attempt to predict the player's choices, as well as understanding which move it should then take to beat the player.</p>
            <p>AI in the browser is difficult for a number of reasons - JavaScript is singlethreaded, which means processing should be kept to a minimum to not lock-up the browser, but to get more accurate results we need a larger set of training data.. but that takes more processing. It takes a lot of tweaking to get a smooth result, even for a simple game like Rock, Paper, Scissors.</p>
            <p>Be aware, your browser might get a bit choppy when playing.</p>
            <div className='neural-networks-container'>
                <div className='player-options'>
                    {!neuralNetTrained && <button onClick={trainNeuralNet}>Train NeuralNetwork</button>}
                    {neuralNetTrained &&
                        <>
                        <button onClick={() => PlayerChose('rock')}>Rock</button>
                        <button onClick={() => PlayerChose('paper')}>Paper</button>
                        <button onClick={() => PlayerChose('scissors')}>Scissors</button>
                        </>
                    }
                </div>
                {neuralNetTrained && <ScoreBoard score={score}/>}
                <div className='cpu-container'>
                    <pre ref={brainOutputEl} className='cpu-brain-output'>
                    {brainOutput.length > 0 &&
                        brainOutput.map((out, i) => typeof out === 'object' ? <code key={i}>{JSON.stringify(out)}</code> : <code key={i} className='cpu-brain-output--comment'>{out}</code>)
                    }
                    {brainOutput.length < 1 &&
                        <>
                        <code className='cpu-brain-output--comment'>...</code>
                        </>
                    }
                    </pre>
                    <CPUChip/>
                </div>
            </div>
        </div>
        </>
    );
}

const CPUChip = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 180 180" fill="none">
            <path d="M34 31H146C147.657 31 149 32.3431 149 34V146C149 147.657 147.657 149 146 149H34C32.3431 149 31 147.657 31 146V34C31 32.3431 32.3431 31 34 31Z" stroke="black" strokeWidth="2"/>
            <path d="M50 47H132C133.657 47 135 48.3431 135 50V132C135 133.657 133.657 135 132 135H50C48.3431 135 47 133.657 47 132V50C47 48.3431 48.3431 47 50 47Z" stroke="black" strokeWidth="2"/>
            <line x1="150" y1="49" x2="160" y2="49" stroke="black" strokeWidth="2"/>
            <line x1="150" y1="69" x2="160" y2="69" stroke="black" strokeWidth="2"/>
            <line x1="150" y1="91" x2="160" y2="91" stroke="black" strokeWidth="2"/>
            <line x1="150" y1="113" x2="160" y2="113" stroke="black" strokeWidth="2"/>
            <line x1="150" y1="135" x2="160" y2="135" stroke="black" strokeWidth="2"/>
            <line x1="49" y1="30" x2="49" y2="20" stroke="black" strokeWidth="2"/>
            <line x1="69" y1="30" x2="69" y2="20" stroke="black" strokeWidth="2"/>
            <line x1="91" y1="30" x2="91" y2="20" stroke="black" strokeWidth="2"/>
            <line x1="113" y1="30" x2="113" y2="20" stroke="black" strokeWidth="2"/>
            <line x1="135" y1="30" x2="135" y2="20" stroke="black" strokeWidth="2"/>
            <line x1="49" y1="160" x2="49" y2="150" stroke="black" strokeWidth="2"/>
            <line x1="69" y1="160" x2="69" y2="150" stroke="black" strokeWidth="2"/>
            <line x1="91" y1="160" x2="91" y2="150" stroke="black" strokeWidth="2"/>
            <line x1="113" y1="160" x2="113" y2="150" stroke="black" strokeWidth="2"/>
            <line x1="135" y1="160" x2="135" y2="150" stroke="black" strokeWidth="2"/>
            <line x1="20" y1="49" x2="30" y2="49" stroke="black" strokeWidth="2"/>
            <line x1="20" y1="69" x2="30" y2="69" stroke="black" strokeWidth="2"/>
            <line x1="20" y1="91" x2="30" y2="91" stroke="black" strokeWidth="2"/>
            <line x1="20" y1="113" x2="30" y2="113" stroke="black" strokeWidth="2"/>
            <line x1="20" y1="135" x2="30" y2="135" stroke="black" strokeWidth="2"/>
        </svg>
    );
}

const ScoreBoard = ({ score }) => {
    return (
        <div className='score-container'>
            <div className='score-outcome'>
                <h2 className='score-outcome-title'>{score.outcome}</h2>
                <div className='score-outcome-numbers'>
                    <h2>{score.playerScore}</h2>
                    <h2>{score.AIScore}</h2>
                </div>
            </div>
            <div className='score-choice-container'>
                <div className='score-choice'>
                    <h2>{score.playerChoice}</h2>
                </div>
                <div className='score-choice'>
                    <h2>{score.AIChoice}</h2>
                </div>
            </div>
        </div>
    );
}