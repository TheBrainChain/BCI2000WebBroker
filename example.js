import { BCI2K_OperatorConnection, BCI2K_DataConnection } from "bci2k";
let bciOperator = new BCI2K_OperatorConnection();
let bciSource = new BCI2K_DataConnection();
const sleep = (ms = 0) => new Promise((resolve) => setTimeout(resolve, ms));

(async () => {
    try{
        // TODO: Ensure BCI2000 is open and Idle
        await bciOperator.connect("ws://localhost:80")
        let response = await bciOperator.execute("GET SYSTEM STATE")
        console.log(`BCI2000 Status: ${response}`);
        bciOperator.resetSystem();
        let script = ``;
        script += `Reset System; `;
        script += `Startup System localhost; `;
        script += `Start executable SignalGenerator; `
        script += `Start executable DummySignalProcessing; `
        script += `Start executable DummyApplication; `
        script += `Set Parameter WSSourceServer *:20100; `
        script += 'Wait for Connected; ';
        script += 'Set Config; ';
        script += 'Start; ';
        bciOperator.execute(script);
        await sleep(4000); //Replace with a check to see if BCI2000 is running
        await bciSource.connect("ws://localhost:20100")

        bciSource.onGenericSignal = signal => {
            // console.log(signal);
        }
        // bciOperator.execute('SET STATE StimulusCode 1') Set the state StimulusCode to 1, indicating an application did something
        bciSource.onStateVector = stateVector => {
            if(stateVector['StimulusCode'] == 1) {  
                // doSomethingInResponseToATaskBeingPresentedToAUser();
            }
        }
        bciSource.onSignalProperties = signalProperties => {
            console.log(signalProperties)
        }
        bciSource.onStateFormat = stateFormat => {
            console.log(stateFormat)
        }
    }
    catch(e){
        console.log(e)
    }

})()
