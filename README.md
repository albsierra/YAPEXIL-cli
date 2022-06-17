# YAPEXIL-cli


[![N|Solid](https://www.inesctec.pt/assets/images/logo-black.svg)](https://www.inesctec.pt/pt)


_YAPEXIL_ is a _JSON_ format in which the goal is to represent in an orthodoxy manner Programming exercises. This type of representation although efficient could sometimes lead to a complexity that can not be handled by a non-expert in this schema. Therefore this npm package focusing in:

- Packaging of exercises
- Validation of a zip that represent an YAPEXIL exercise
## Instaling
First download the repository. Then in the folder where the package.json exists, run
```js
sudo npm i --location=global
```

## Examples
### Validating an zip file 
```js
YAPEXIL --validate --dir ./ --filename c9d68b4f-e306-41f5-bba3-cafdcd024bfb.zip 
```
```js
YAPEXIL --validate --dir "file directory" --filename "file name"
```


Ex:
![N|Solid](https://raw.githubusercontent.com/zub4t/Static_files/main/error.png)
![N|Solid](https://raw.githubusercontent.com/zub4t/Static_files/main/success.png)
![N|Solid](https://raw.githubusercontent.com/zub4t/Static_files/main/warning.png)

### Packaging an exercise
```js
YAPEXIL --create --dir ./resources/metadata.json  --out ./ --base /mnt/c/Users/marco/Documents/TESTE
```
```js
YAPEXIL --create --dir "meta file for the exercise"  --out "exercise zip output" --base "folder containing the necessary files for packaging a YAPEXIL exercise"
```

Ex: The file metada.json contain the following:
```json
{
    "id": "be3bf258-895f-4f5b-bbe9-b716d75f4261",
    "title": "Totalling by key and numerical value",
    "module": "",
    "owner": "JuezLTI Erasmus+",
    "keywords": [],
    "type": "BLANK_SHEET",
    "event": "",
    "platform": "",
    "difficulty": "AVERAGE",
    "status": "DRAFT",
    "timeout": 0,
    "programmingLanguages": [
        "xpath"
    ],
    "created_at": "2021-12-11T17:21:06.419Z",
    "updated_at": "2021-12-11T17:21:06.419Z",
    "author": "Mew",
    "solutions": [{
        "id": "00000000-0000-0000-0000-000000000000",
        "pathname": "solution.txt",
        "lang": "cpp"
    }],
    "tests": [{
        "id": "00000000-0000-0000-0000-000000000000",
        "arguments": [],
        "weight": 5,
        "visible": true,
        "input": "input.txt",
        "output": "output.txt"
    }],
    "statements": [{
        "id": "00000000-0000-0000-0000-000000000000",
        "pathname": "statement.txt",
        "nat_lang": "en",
        "format": "HTML"
    }]
}
```

Then inside the repository --base  must exist the files:
```json
total 0
-rwxrwxrwx 1 marco marco  66 Mar 23 18:49 input.txt
-rwxrwxrwx 1 marco marco  67 Mar 23 18:50 output.txt
-rwxrwxrwx 1 marco marco  68 Mar 23 18:50 solution.txt
-rwxrwxrwx 1 marco marco 387 Mar 23 18:50 statement.txt
```
And by each file the content should be:
```json
 {"id": "00000000-0000-0000-0000-000000000000","content":"4"}
 ```
Informing the ID of the resource and the content
![N|Solid](https://raw.githubusercontent.com/zub4t/Static_files/main/success-create-http.png)
![N|Solid](https://raw.githubusercontent.com/zub4t/Static_files/main/success-create.png)

## License

MIT



   
