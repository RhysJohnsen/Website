function createMatrix(){
    let value = document.getElementById("test1").value;
    document.getElementById("output").innerHTML = value.toString();
    document.createElement();
}

function runMatrix(){
    let input = document.getElementById("matirxInput").value;
    let matrixArray = parseInput(input);
    let toPrint = more(matrixArray);
    console.log(toPrint);
    document.getElementById("output").innerHTML = "The determinant is " + toPrint;
}

function parseInput(input){
    let sepLines=input.split("\n");
    let toReturn = [[]];
    let index = 0;
    sepLines.forEach(element => {
        toReturn[index] = element.split(" ");
        if(toReturn[index].length != sepLines.length){
            return [[-1]];
        }
        index++;
    });
    console.log(toReturn[1][2]);
    return toReturn;
}

function more(input){
    let answer = 0;
    for(let k = 0; k < input.length; k++){
        let smaller = [[],[]];
        let smallRow = 0;
        let smallCol = 0;
        for(let i = 1; i < input.length; i++){
            smallRow = 0;
            for(let j = 0; j < input.length; j++){
                if(j != k){
                    smaller[smallCol][smallRow] = input[i][j];
                    smallRow++;
                }
            }
            smallCol++;
        }
        if(k % 2 == 0){
            if(smaller.length == 2){
                answer += two(smaller) * input[0][k];
            }
            else{
                answer += more(smaller) * input[0][k];
            }
        }
        else{
            if(smaller.length == 2){
                answer -= two(smaller) * input[0][k];
            }
            else{
                answer -= more(smaller) * input[0][k];
            }
        }
    }
    return answer;
}

function two(input){
    let toReturn = input[0][0] * input[1][1];
    toReturn -= input[0][1] * input[1][0];
    return toReturn;
}