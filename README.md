# YAPEXIL-cli


[![N|Solid](https://www.inesctec.pt/assets/images/logo-black.svg)](https://www.inesctec.pt/pt)


_YAPEXIL_ is a _JSON_ format in which the goal is to represent in an orthodoxy manner Programming exercises. This type of representation although efficient could sometimes lead to a complexity that can not be handled by a non-expert in this schema. Therefore this npm package focusing in:

- Packaging of exercises
- Validation of a zip that represent an YAPEXIL exercise
- Import and packaging of a set of exercises stored in a .ods spreadsheet
## Instaling
First download the repository. Then in the folder where the package.json exists, run
```js
sudo npm i --location=global
```

## Examples
### Validating an zip file 
```js
YAPEXIL --validate --dir ./exercises/ --exercise 8b5a8565-74ff-41a5-b7aa-8616042693fd.zip 
```
```js
YAPEXIL --validate --dir "file directory" --exercise "file name"
```



### Creating an exercise
```js


YAPEXIL --create --id 9d85d08f-bb6b-4fd6-9e6b-9b4406453639 --author author_name --title Example --keywords xml-exercise-programing 
--type IMPROVEMENT  --status DRAFT

// The output of this command will be the ID exercise.

YAPEXIL --modify --exercise 9d85d08f-bb6b-4fd6-9e6b-9b4406453639.zip --statement_addition --statement_format PDF --statement_nat_lang EN --statement_content ./resources/example/JuezLTI\ DTD+XSD\ Exercise\ example.pdf  

//This command will add a statement


YAPEXIL --modify --exercise 9d85d08f-bb6b-4fd6-9e6b-9b4406453639.zip  --skeleton_addition --skeleton_lang xml --skeleton_content ./resources/example/SportEvents/base\ XML\ example/SportEvent.xml

//This command will add a skeleton

YAPEXIL --modify --exercise 9d85d08f-bb6b-4fd6-9e6b-9b4406453639.zip  --library_addition  --library_content ./resources/example/SportEvents/base\ XML\ example/SportEvent.xml
//This command will add a library

YAPEXIL --modify --exercise 9d85d08f-bb6b-4fd6-9e6b-9b4406453639.zip --solution_addition --solution_lang xml --solution_content ./resources/example/SportEvents/solution.xml

//This command will add a solution

YAPEXIL --modify --exercise 9d85d08f-bb6b-4fd6-9e6b-9b4406453639.zip --test_addition --test_visibility true --test_input_content ./resources/example/SportEvents/test\ cases/SportEvent_Q01_1_valid.xml --test_output_content ./resources/example/SportEvents/output_valid.txt

//This command will add a  test

YAPEXIL --modify --exercise 9d85d08f-bb6b-4fd6-9e6b-9b4406453639.zip --test_addition --test_visibility true --test_input_content ./resources/example/SportEvents/test\ cases/SportEvent_Q01_2_invalid.xml --test_output_content ./resources/example/SportEvents/output_invalid.txt --test_feedback essa_e_uma_menssagem-esse_e_outra_menssagem-uma_terceira_:D

//This command will add a  test



YAPEXIL --modify --exercise 9d85d08f-bb6b-4fd6-9e6b-9b4406453639.zip --test_remove --test_id 00000000-0000-0000-0000-000000000000 --solution_remove --solution_id 00000000-0000-0000-0000-000000000000 --statement_remove --statement_id 00000000-0000-0000-0000-000000000000
// This command will remove some default stuff





**Combining all commands into one**

YAPEXIL --modify --exercise 9d85d08f-bb6b-4fd6-9e6b-9b4406453639.zip --statement_addition --statement_format PDF --statement_nat_lang EN --statement_content ./resources/example/JuezLTI\ DTD+XSD\ Exercise\ example.pdf --skeleton --skeleton_addition --skeleton_lang xml --skeleton_content ./resources/example/SportEvents/base\ XML\ example/SportEvent.xml --solution_addition --solution_lang xml --solution_content ./resources/example/SportEvents/solution.xml --test_addition --test_visibility true --test_input_content ./resources/example/SportEvents/test\ cases/SportEvent_Q01_2_invalid.xml --test_output_content ./resources/example/SportEvents/output_invalid.txt --test_feedback essa_e_uma_menssagem-esse_e_outra_menssagem-uma_terceira_:D --library_addition  --library_content ./resources/example/SportEvents/base\ XML\ example/SportEvent.xml --test_remove --test_id 00000000-0000-0000-0000-000000000000 --solution_remove --solution_id 00000000-0000-0000-0000-000000000000 --statement_remove --statement_id 00000000-0000-0000-0000-000000000000

```






### Import from an .ods spreadsheet 
```js
YAPEXIL --import --out ~/Documents --from ~/Documents/ct_question.ods --rows=3 
```
```js
YAPEXIL --import --out "file directory" --from "file name" [--rows=number]
```
An import [template file is provided](https://github.com/JuezLTI/YAPEXIL-cli/blob/master/resources/importTemplate.ods) to facilitate the import of questions.
## License

MIT



   
