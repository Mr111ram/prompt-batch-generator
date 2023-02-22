(function() {
    const promptTemplate = "a girl with {1}, solo, in the {2}";    
    const promptParams = [
        ['white hair', 'blue hair', 'black hair'],
        ['room', 'bad']
    ]


    const batchVariables = []
    const batch = [];
    const parseRegexp = /{(\d+)}/g;
    function getCombn(arr, pre) {
        pre = pre || '';
        if (!arr.length) {
            return pre;
        }
        let ans = arr[0].reduce(function(ans, value) {
            return ans.concat(getCombn(arr.slice(1), pre + ',' + value));
        }, []);
        return ans;
    }

    getCombn(promptParams).map(line => {
        const result = line.split(',').filter(v => !!v);
        batchVariables.push(result);
    })

    const batchLength = batchVariables.length;

    for (let index = 0; index < batchLength; index++) {
        let prompt = promptTemplate;
        const entries = promptTemplate.match(parseRegexp);
        entries.map(entry => {
            const id = entry.replace('{', '').replace('}', '') - 1
            prompt = prompt.replaceAll(entry, batchVariables[index][id])
        })
        batch.push(prompt);
    }

    const result = batch.join('.\n')
    const file = new Blob([result], {type: 'txt'})
    const a = document.createElement('a')
    a.href = URL.createObjectURL(file);
    a.download = 'batch';
    a.click();
})()