window.onload = () => {
    if (readFromLocal('ec2-names') !== null)
        populateDropDown(readFromLocal('ec2-names').split(','));
    else {
        let headers = new Headers();

        headers.append("Content-type", "application/json");

        let request_options = {
            method: "GET",
            headers: headers
        };

        fetch('https://7ota1zqbli.execute-api.us-east-1.amazonaws.com/dev',
            request_options)
            .then(resp => resp.text())
            .then(result => {
                resultJson = JSON.parse(result);
                bodyJson = JSON.parse(resultJson['body']);
                ec2Names = bodyJson['instances'];

                populateDropDown(ec2Names);

                saveToLocal('ec2-names', ec2Names);
            });
    }
};

const start = () => {
    const dropDown = document.getElementById('dropDown');

    let selectedName = dropDown.options[dropDown.selectedIndex].text;

    let headers = new Headers();

    headers.append("Content-type", "application/json");

    let request_options = {
        method: "POST",
        headers: headers,
        body: JSON.stringify({ 'name': selectedName, 'action': 'start' })
    };

    fetch('https://7ota1zqbli.execute-api.us-east-1.amazonaws.com/dev/trigger',
        request_options)
        .then(resp => resp.text())
        .then(result => alert(JSON.parse(result)['body']));
};

const stop = () => {
    const dropDown = document.getElementById('dropDown');

    let selectedName = dropDown.options[dropDown.selectedIndex].text;

    let headers = new Headers();

    headers.append("Content-type", "application/json");

    let request_options = {
        method: "POST",
        headers: headers,
        body: JSON.stringify({ 'name': selectedName, 'action': 'stop' })
    };

    fetch('https://7ota1zqbli.execute-api.us-east-1.amazonaws.com/dev/trigger',
        request_options)
        .then(resp => resp.text())
        .then(result => alert(JSON.parse(result)['body']));
};

const populateDropDown = (values) => {
    const placeholderText = document.getElementById('loading-text')
    const dropDown = document.createElement('select');
    dropDown.name = 'ec2-names';
    dropDown.id = 'dropDown';

    values.forEach((name) => {
        const option = document.createElement('option');
        option.value = name;
        option.text = name;
        dropDown.append(option);
    });

    document.getElementById('select-container').replaceChild(dropDown, placeholderText);
};

const saveToLocal = (key, val) => {
    if (localStorage.getItem(key) === null)
        localStorage.setItem(key, val);
};

const readFromLocal = (key) => localStorage.getItem(key);