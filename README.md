# Instruction

+ `node server` to start the telnet-ws broker so that the client (node process or browser) can talk to the BCI2000 Operator telnet server
+ `node example`
    - Connect to telnet-ws broker server
    - Query the Operator state
    - Reset the system
    - Setup a script to:
        - Start the source, filter, and application executables.
        - Set the Source WS server port.
        - Set config and start
    - Connect to the Source WS server
    - Set up 4 callbacks to different stages of the BCI2000 pipeline
        - onGenericSignal: read the raw data
        - onStateVector: read the state vector to sync states/events and neural signal
        - onSignalProperties: channels, elements, etc
        - stateFormat: What's in the state vector
    * Typically only use onGenericSignal and onStateVector
