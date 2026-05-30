sequenceDiagram
    participant browser
    participant server

    Note right of browser: User writes a new note in the text field
    Note right of browser: User clicks the submit button

    Note right of browser: The JavaScript event handler catches the form submit event
    Note right of browser: e.preventDefault() prevents the default form submission

    Note right of browser: The browser creates a new note object with content and date
    Note right of browser: The new note is added to the local notes array
    Note right of browser: The browser redraws the notes list on the page

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    activate server

    Note right of browser: The note is sent as JSON data
    Note right of browser: Content-Type: application/json

    Note right of server: The server receives the JSON data
    Note right of server: The server stores the new note

    server-->>browser: HTTP 201 Created
    deactivate server

    Note right of browser: The browser stays on the same page
    Note right of browser: No redirect or page reload happens