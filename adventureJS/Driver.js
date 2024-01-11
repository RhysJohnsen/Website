var Game={};
//Game.coords = 5050;
/*
Game.mapArray = [];
    
new Game.Map(5050, "A cold, damp prison cell.", 1);
new Game.Map(4950, "A cobblestone hallway.", 12);
new Game.Map(4951, "A barracks.", 15);
console.log("Map Initialized");
*/

Game.write = function(toWrite){
    document.getElementById("output").innerHTML = toWrite;
}

/*
Game.init = function(){
    Game.mapArray = [];
    Game.itemArray = [];
    
    new Game.Map(5050, "A cold, damp prison cell.", 1);
    new Game.Map(4950, "A cobblestone hallway.", 12);
    new Game.Map(4951, "A barracks.", 15);
    console.log("Map Initialized");
    //1 - weapon
    //2 - armor
    new Game.Item(1, 1, "Rusty Dagger", 3, 5);
    //console.log(Game.mapArray[4951].desc);
};
*/

Game.Map = function(idin, descin, dirin, itemsin, npcsin){
    this.id = idin;
    this.desc = descin;
    this.dir = dirin;
    this.itemArray = [];
    itemsin.forEach(element => {
        this.itemArray[this.itemArray.length] = structuredClone(Game.itemArray[element]);
    });
    this.npcArray = [];
    npcsin.forEach(element => {
        this.npcArray[this.npcArray.length] = structuredClone(Game.npcArray[element]);
    });
    Game.mapArray[idin] = this;
};

Game.Item = function(idin, typein, namein, weightin, effectin){
    this.id = idin;
    this.type = typein;
    this.name = namein;
    this.weight = weightin;
    this.effect = effectin;
    this.isEquipped = false;
    Game.itemArray[idin] = this;
};

Game.Npc = function(idin, namein, healthin, itemsin){
    this.id = idin;
    this.name = namein;
    this.health = healthin;
    this.itemArray = [];
    itemsin.forEach(element => {
        if(Math.random() <= element[1]){
            this.itemArray[this.itemArray.length] = structuredClone(Game.itemArray[element[0]]);
        }
    });
    this.equipped = [];
    this.itemArray.forEach(element => {
        if(this.equipped[element.type] == undefined || this.equipped[element.type].effect < element.effect){
            this.equipped[element.type] = element;
        }
    });
    Game.npcArray[idin] = this;
}


Game.look = function(){
    output = "";
    output += Game.mapArray[Game.coords].desc;
    if(Game.mapArray[Game.coords].itemArray.length > 0){
        output += " On the ground, you see: ";
        Game.mapArray[Game.coords].itemArray.forEach(element => {
            output += element.name + ", ";
        });
        output = output.substring(0, output.length - 2);
        output += ".";
    }
    if(Game.mapArray[Game.coords].npcArray.length > 0){
        output += " Around you, there is: ";
        Game.mapArray[Game.coords].npcArray.forEach(element => {
            output += element.name + ", ";
        });
        output = output.substring(0, output.length - 2);
        output += ".";
    }
    Game.write(output);
};

Game.addMap = function(input){
    Game.mapArray[Game.coords].itemArray[Game.mapArray[Game.coords].itemArray.length] = structuredClone(Game.itemArray[input]);
};

Game.removeMap = function(input){
    items = Game.mapArray[Game.coords].itemArray;
    index = items.findIndex(x => x.name.toLowerCase() === input);
    if(index < 0){
        return null;
    }
    else{
        toReturn = structuredClone(items[index]);
        items.splice(index, 1);
        console.log(items);
        return toReturn;
    }
}

Game.listInven = function(){
    let output = "";
    let totalWeight = 0;
    Game.inventory.forEach(element => {
        totalWeight += element.weight;
        if(element.isEquipped){
            output += "E: ";
        }
        output += element.name + " w: " + element.weight + " p: " + element.effect + "<br/>";
    });
    output += "Total Weight: " + totalWeight;
    Game.write(output);
};

Game.addInven = function(input){
    if(typeof input == "number"){
        Game.inventory[Game.inventory.length] = structuredClone(Game.itemArray[input]);
    }
};

Game.removeInven = function(input){
    index = Game.inventory.findIndex(x => x.name.toLowerCase() === input);
    console.log(index);
    if(index < 0){
        return null;
    }
    else{
        toReturn = structuredClone(Game.inventory[index]);
        Game.inventory.splice(index, 1);
        console.log(Game.inventory);
        return toReturn;
    }
};

Game.equip = function(input){
    index = Game.inventory.findIndex(x => x.name.toLowerCase() === input);
    Game.equipped[Game.inventory[index].type] = Game.inventory[index];
    Game.inventory[index].isEquipped = true;
    Game.write("Equipped " + Game.inventory[index].name);
};

Game.unequip = function(input){
    index = Game.inventory.findIndex(x => x.name.toLowerCase() === input);
    Game.equipped[Game.inventory[index].type] = undefined;
    Game.inventory[index].isEquipped = false;
    Game.write("Unequipped " + Game.inventory[index].name);
}

Game.combat = function(source, target){
    let dmg = 0;
    let def = 0;
    console.log(source);
    console.log(target);
    if(source == "self"){
        if(Game.equipped[0] == undefined){
            dmg = 1;
        }
        else{
            dmg = Game.equipped[0].effect;
        }
    }
    else{
        if(source.equipped[0] == undefined){
            dmg = 1;
        }
        else{
            dmg = source.equipped[0].effect;
        }
    }
    if(target == "self"){
        Game.equipped.slice(1).forEach(element => {
            def += element.effect;
        });
        def *= -0.01;
        def += 1;
        dmg *= def;
        Game.health -= dmg;
        console.log(Game.health);
    }
    else{
        target.equipped.slice(1).forEach(element => {
            def += element.effect;
        });
        def *= -0.01;
        def += 1;
        dmg *= def;
        target.health -= dmg;
    }
}

Game.step = function(){

    if(event.key === 'Enter'){
        console.log("Enter key was pressed");
    }
    else{
        return("filler");
    }

    let input = document.getElementById("input").value;
    input = input.toLowerCase();
    let wordIndex = input.indexOf(' ');

    if(wordIndex < 0){
        wordIndex = input.length;
    }

    switch(input.substring(0, wordIndex)){
        case "look":
            Game.look();
        break;
        case "go":
            switch(input.substring(wordIndex + 1)){
                case "north":
                    if((Game.mapArray[Game.coords].dir & 8) > 0){
                        Game.coords += 1;
                        console.log(Game.coords);
                        //Game.write(Game.mapArray[Game.coords].desc);
                        Game.look();
                    }
                    else{
                        Game.write("You can't go that way");
                    }
                    break;
                case "east":
                    if((Game.mapArray[Game.coords].dir & 4) > 0){
                        Game.coords += 100;
                        console.log(Game.coords);
                        //Game.write(Game.mapArray[Game.coords].desc);
                        Game.look();
                    }
                    else{
                        Game.write("You can't go that way");
                    }
                    break;
                case "south":
                    if((Game.mapArray[Game.coords].dir & 2) > 0){
                        Game.coords -= 1;
                        console.log(Game.coords);
                        //Game.write(Game.mapArray[Game.coords].desc);
                        Game.look();
                    }
                    else{
                        Game.write("You can't go that way");
                    }
                    break;
                case "west":
                    if((Game.mapArray[Game.coords].dir & 1) > 0){
                        Game.coords -= 100;
                        console.log(Game.coords);
                        //Game.write(Game.mapArray[Game.coords].desc);
                        Game.look();
                    }
                    else{
                        Game.write("You can't go that way");
                    }
                    break;
                default:
                    Game.write("Not a valid direction");
            }
        break;
        case "inventory":
            Game.listInven();
        break;
        case "take":
            let toAdd = Game.removeMap(input.substring(wordIndex + 1));
            if(toAdd != null){
                Game.addInven(toAdd.id);
            }
        break;
        case "drop":
            let toRemove = Game.removeInven(input.substring(wordIndex + 1));
            console.log(toRemove);
            if(toRemove != null){
                console.log("success");
                Game.addMap(toRemove.id);
            }
        break;
        case "equip":
            Game.equip(input.substring(wordIndex + 1));
        break;
        case "unequip":
            Game.unequip(input.substring(wordIndex + 1));
        break;
        case "attack":
            Game.combat("self", input.substring(wordIndex + 1));
        break;
    default:
        Game.write("Not a valid command");
    }
    document.getElementById("input").value = "";
};


Game.coords = 5050;

Game.mapArray = [];
Game.itemArray = [];
Game.npcArray = [];

Game.health = 100;

//0 - weapon
//1 - boots
//2 - pants
//3 - shirt
//4 - gloves
//5 - helmet
//id, equipslot, name, weight, effectiveness
new Game.Item(1, 0, "Rusty Dagger", 3, 5);
new Game.Item(2, 3, "Tattered Tunic", 5, 1);
new Game.Item(3, 2, "Tattered Leggings", 5, 1);
console.log("Items Initialized");

new Game.Npc(1, "Old Prisoner", 3, [[2, 0.5], [3, 1]]);
console.log("NPCs Initialized");
//console.log(Game.npcArray[1]);

//coordinates, description, exits, items
//exits are done by the binary value of the number, each digit represents north, east, south, & west.
new Game.Map(5050, "A cold, damp prison cell.", 1, [1], [1]);
new Game.Map(4950, "A cobblestone hallway.", 12, [1], []);
new Game.Map(4951, "A barracks.", 15, [1], []);
new Game.Map(5051, "An armoury", 1, [1], []);
console.log("Map Initialized");


Game.inventory = [];
Game.equipped = [];
Game.addInven(2);
Game.addInven(3);
Game.equip("tattered tunic");
Game.equip("tattered leggings");

Game.look();
//console.log(Game.equipped);
/*

let increase = "Z";
let testString = "-";


function runGame(){
    console.log(testString);
    let inputTxt = document.getElementById("input").value;
    //console.log(input(inputTxt));
    console.log(inputTxt);
    increase += inputTxt;
    //console.log(input(increase));
    console.log(increase);
    increase = input(increase);
    console.log(increase);

    document.getElementById('inputfile')
    .addEventListener('change', function () {

        let fr = new FileReader();
        fr.onload = function () {
            console.log(fr.result);
        }

        fr.readAsText(this.files[0]);
    })

};

function test(){
    console.log("testing");
}
*/