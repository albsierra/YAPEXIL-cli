# YAPEXIL-cli


[![N|Solid](https://www.inesctec.pt/assets/images/logo-black.svg)](https://www.inesctec.pt/pt)


_YAPEXIL_ is a _JSON_ format in which the goal is to represent in an orthodoxy manner Programming exercises. This type of representation although efficient could sometimes lead to a complexity that can not be handled by a non-expert in this schema. Therefore this npm package focusing in:

- Packaging of exercises
- Validation of a zip that represent an YAPEXIL exercise

## Examples
### Validating an zip file 
```js
YAPEXIL --validate --dir be3bf258-895f-4f5b-bbe9-b716d75f4261.zip --silent
```
In the shell execute the program above to validate a zip file. The flag --validate --dir are mandatory.
The --silent flag changes how the output of this program will be generated. If the flag is present then the ouput will be 0 for correct exercises 1 for wrong exersices and 2 when the exercise is correct but the zip file contain more files than the required
Ex:
![N|Solid](https://raw.githubusercontent.com/zub4t/Static_files/main/error.png)
![N|Solid](https://raw.githubusercontent.com/zub4t/Static_files/main/success.png)
![N|Solid](https://raw.githubusercontent.com/zub4t/Static_files/main/warning.png)

### Packaging an exercise
```js
YAPEXIL  --create --dir ./metadata.json --out ~ --base http://localhost/YAPEXIL
or
YAPEXIL  --create --dir ./metadata.json --out ~ --base /mnt/c/xampp/htdocs/YAPEXIL
```
In the shell execute the program above to packaging an exercise. The flag --create --dir and --base are mandatory.
The --base flag can be an remote repository or a local one. Inside this repository must exist the files indicated by the metadata.json
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
        "input": "input1.txt",
        "output": "output1.txt"
    }],
    "statements": [{
        "id": "00000000-0000-0000-0000-000000000000",
        "pathname": "statement.txt",
        "nat_lang": "en",
        "format": "HTML"
    }]
}
```

Then inside the repository .../YAPEXIL must exist the files:
```json
total 0
-rwxrwxrwx 1 marco marco  66 Mar 23 18:49 input1.txt
-rwxrwxrwx 1 marco marco  67 Mar 23 18:50 output1.txt
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



   
