const readline = require("readline");
const r1 = readline.createInterface(process.stdin, process.stdout);

function ask(questionText) {
  return new Promise((resolve, reject) => {
    r1.question(questionText, resolve);
  });
}
//State machine. Displays all valid transitions for each room.
let rooms = {
  mainStreet: {
    canEnter: ["foyer"],
  },
  foyer: {
    canEnter: ["kitchen"],
  },
  kitchen: {
    canEnter: ["library", "foyer"],
  },
  library: {
    canEnter: ["study", "psychomanteum", "cellar", "kitchen"],
  },
  study: {
    canEnter: ["library"]
  },
  psychomanteum: {
    canEnter: ["library", "door"]
  },
  cellar: {
    canEnter: ["library"]
  },
  door: {
    canEnter: ["library"]
  },


};

//Initial room
let currRoom = "mainStreet";

//Item class with constructor that initializes a name, description, and whether or not the item can be taken. canTake is a boolean. 
class Item {
  constructor(name, description, canTake) {
    (this.name = name),
      (this.description = description),
      (this.canTake = canTake);
  }
}
//Create instance of each item using Item class.
const picture = new Item(
  "picture",
  "It's an outdated, framed picture of a couple standing in front of this mansion.\nMight have been taken almost a century ago...",
  false
);
const cube = new Item(
  "cube",
  "A myserious cube with ancient writing on it.",
  true
);
const newspaper = new Item(
  "newspaper",
  "The newspaper reads 'The Death of the Blanche Family - April 14, 1932'",
  true
);
const book = new Item(
  "book",
  "An old, dusty book. The pages have descriptions of various spirits and ghosts along with drawings...",
  true
);
const key = new Item(
  "key",
  "A rusted, gold key. Maybe you can enter a door with this?",
  true
);
const wine = new Item(
  "wine",
  "An aged bottle of wine.",
  true
);
const parchment = new Item(
  "parchment",
  "'This ancient cube can grant its user a certain myserious power...'",
  true
);
//Item lookup table
let itemLookUp = {
  picture: picture,
  cube: cube,
  newspaper: newspaper,
  book: book,
  key: key,
  wine: wine,
  parchment: parchment,
};

//Room class with constructor that initializes name, description, a room inventory array, and whether or not the room is unlocked. Unlocked is a boolean.
class Room {
  constructor(name, description, roomInv, unlocked) {
    this.name = name;
    this.description = description;
    this.roomInv = roomInv;
    this.unlocked = unlocked;
  }
}
//Create instance of each room with Room class
const mainStreet = new Room(
  "mainStreet",
  "\nIt's a dark damp night and you are on the road out in front of 182 Main St.\n An old, abandoned mansion lies in front of you. The door swings open and leads to the foyer...",
  [],
  true
);
const foyer = new Room(
  "foyer",
  "\nYou enter the foyer. The door slams shut behind you.\nThere is a broken staircase to your left which would have lead to the second floor. \nYou see an open newspaper sprawled out on a small table near the main door.\nThe only way forward is a tall entrance to what appears to be a kitchen...",
  ["newspaper"],
  true
);
const library = new Room(
  "library",
  "\nYou have entered the library...\nThere are hundreds of books in shelves leading up to the ceiling... One specific book in a far corner catches your eye. It seemed to have fallen off of a shelf...\nThere also seems to be three different ways to exit the library.\nA door in the back wall of the library seems to lead to a private study...\nThere is also a door in a far, dark corner of the library.\nUpon checking the window you see that it leads to a small psychomanteum...\nIn the right wing of the library there is a wall with a outline of a small door but no doorknob...Upon moving closer to the transom, you see a staircase leading down to a cellar...   ",
  ["book"],
  true
);
const study = new Room(
  "study",
  "\nYou have entered the study...There is a small desk with a candlelight and a piece of parchment.\nNext to the parchment lies an artifact which looks like a cube...  ",
  ["cube", "parchment"],
  true
);
const psychomanteum = new Room(
  "psychomanteum",
  "\nYou have entered the psychomanteum...\nSo long as you hold this mysterious, ancient book,\nyou can walk through the room without being noticed by evil spirits...\nAt the far end of the room is a large, mahogany door that appears to lead to the outside world...",
  [],
  true
);
const kitchen = new Room(
  "kitchen",
  "\nYou have entered the kitchen...There are old, rusted pots and pans all over the sink...\nTo the far right of the counter lies a picture...\nAt the end of the kitchen is a huge archway that seems to lead to a giant libray...",
  ["picture"],
  true
);
const cellar = new Room(
  "cellar",
  "\nYou have entered the wine cellar!\nThe cube you have mysteriously grants a power that lets you travel through the door without opening it...\nThere is a wine bottle already on top of one of the barrels.\nUnder the barrel, you get a small glimpse of a shiny key...",
  ["wine", "key"],
  false
);
const door = new Room(
  "door",
  "\nYou use the key you found on the door and it unlocks!\nYou run outside with a heave of relief as you collapse on the ground, exhausted.\nThe nightmare in this haunted mansion is over...",
  [],
  false
);
//Room Lookup table
let roomLookUp = {
  mainStreet: mainStreet,
  foyer: foyer,
  library: library,
  study: study,
  psychomanteum: psychomanteum,
  kitchen: kitchen,
  cellar: cellar,
  door: door,
};
//Player object that has an inventory array and location variable
const player = {
  currInventory: [],
  currLocation: null,
};
//Lookup table for playerActions
let playerActions = {
  enter: ["enter"],
  take: ["take", "pickup", "grab"],
  drop: ["drop"],
  examine: ["examine", "inspect"],
};

//Move room function
function moveTo(newRoom) {
  let validTransitions = rooms[currRoom].canEnter;
  //If use tries to enter the final door and it is locked:
  if (
    validTransitions.includes(newRoom) &&
    roomLookUp[newRoom].unlocked === false && newRoom === "door"
  ) {
    //If they have they key, update the newRoom to door and let them out (Description of door has a win message)
    if (player.currInventory.includes("key")) {
      door.unlocked = true;
      currRoom = newRoom;
      let roomObject = roomLookUp[currRoom];
      //description for the rooms

      console.log(roomObject.description);

      //If they don't have a key, display a locked message
    } else {
      console.log(
        "The door before you is locked. You are still trapped in this mansion unless you find a key..."
      );
    }
  }
  //If the user tries to enter the cellar and it is locked:
  else if (
    validTransitions.includes(newRoom) &&
    roomLookUp[newRoom].unlocked === false && newRoom === "cellar"
  ) {
    //If the player has the cube, the cellar unlocks. 
    if (player.currInventory.includes("cube")) {
      cellar.unlocked = true;
      currRoom = newRoom;
      let roomObject = roomLookUp[currRoom];
      //description

      console.log(roomObject.description);

    }
    //If they dont have the cube, display a locked message
    else {
      console.log("There's no door knob...But there seems to be some ancient writing carved into the wall above the door...")
    }

  }
  //If the user tries to enter the psychomanteum
  else if (validTransitions.includes(newRoom) && roomLookUp[newRoom].unlocked === true && newRoom === "psychomanteum") {
    //If the user has the book, they can enter the room without being harmed (Displayed in the room description)
    if (player.currInventory.includes("book")) {
      currRoom = newRoom;
      roomObject = roomLookUp[currRoom];
      //description

      console.log(roomObject.description)
    }

    else {
      //If the user doesn't have the book, ghosts swarm around and kill the user. The game ends.
      console.log("\nYou enter the psychomanteum...In the middle of the room there is a chair, a table with a candle on it, and a mirror...\nThe candle light flickers for a few seconds before finally going out...\nA swarm of ghosts suddenly surround you...\nThey feed on your soul one by one...\nYou're dead...")
      process.exit()
    }
  }

  //If the room exists and the door is not locked:
  else if (
    validTransitions.includes(newRoom) &&
    roomLookUp[newRoom].unlocked === true
  ) {
    //Update the current room to the room you're trying to move to (newRoom)
    currRoom = newRoom;
    roomObject = roomLookUp[currRoom];
    //console log the room descriptions
    console.log(roomObject.description);
  }
  //If the room change is invalid:
  else {
    console.log(
      "Invalid transition. Please try again."
    );
  }
  //Update player location during each room transition
  player.currLocation = roomLookUp[currRoom];
}

//Sanitize function
function sanitizeInput(dirtyInput) {
  let sanitized = dirtyInput.trim().toLowerCase();
  return sanitized;
}
// Examine item function
function examineItem(examinable) {
  //Gain access to the item object by using the item lookup table
  let itemObject = itemLookUp[examinable];
  //If the room has the item or the player's inventory contains the item:
  if (player.currLocation.roomInv.includes(examinable) || player.currInventory.includes(examinable)) {
    console.log(itemObject.description);
    //If the player doesn't have the item:
  } else {
    console.log("There's nothing to inspect...");
  }
}
//Take item function
function takeItem(currItem) {
  //Gain access to the item object by using the item lookup table
  let certainItem = itemLookUp[currItem];

  //Check if the item exists
  if (!certainItem) {
    console.log("That does not exist in this room...");
  }//If the item is takeable and the room inventory contains the item: 
  else if (
    certainItem.canTake === true &&
    player.currLocation.roomInv.includes(currItem)
  ) {
    //Remove the item from the current room's inventory and push it to the player's inventory
    player.currLocation.roomInv.splice(player.currLocation.roomInv.indexOf(currItem), 1);
    player.currInventory.push(currItem);
    console.log(`You picked up the ${currItem}.`);
    //If the item doesn't exist or has already been take, display an error message
  } else {
    console.log("You can't take this item or already have it in your inventory!");
  }
}
//Drop item function
function dropItem(droppableItem) {
  //If the player's inventory has the book and tries to drop it in the psychomanteum, display specific error message. Without this functionality, if the player drops the book and leaves it here, they will not be able to re enter the psychomanteum without dying. 
  if (player.currInventory.includes(droppableItem) && player.currLocation.name === "psychomanteum" && droppableItem === "book") {
    console.log("The mysterious book glows...It can't be dropped here...")
  }
  //If the player's inventory has the item, remove it from from that array and then push it into the room inventory array
  else if (player.currInventory.includes(droppableItem)) {
    player.currInventory.splice(player.currInventory.indexOf(droppableItem), 1);
    player.currLocation.roomInv.push(droppableItem);
    console.log(`You have dropped the ${droppableItem} in the ${player.currLocation.name}.`);
  }
  else {
    //Display error message if they try to drop an item they don't have
    console.log("You don't have this item!");
  }
}

// Calling the beginGame function to beginGame the game initially.
beginGame();
// The beginGame function displays the game intro and instructions. It is used to call various functions based on userinput.
async function beginGame() {
  console.log(
    "It's a dark damp night and you are on the road out in front of 182 Main St.\nIn front of you lies a mansion with its door open. It leads to the foyer...\nTo move to a room type 'enter', followed by the room name.[ie enter foyer]\nTo take or drop an item type 'take' or 'drop' followed by the item name.\nTo examine an item type 'examine' followed by the item name.\nTo check current player status, type 'status'."
  );
  //currLocation is initalized to null so set it to mainStreet at the start
  player.currLocation = mainStreet
  //While the player has not reached the final door:
  while (currRoom !== "door") {
    //Take in userInput.
    let userInput = await ask(">_");
    //Sanitize userInput
    let sanitizedInput = sanitizeInput(userInput);
    //Split the userInput into array with two strings. First string(user action) is assigned to the command variable while second string(room or item) is assigned to the roomOrItem variable. 
    let splitInput = sanitizedInput.split(" ");
    let command = splitInput[0];
    let itemOrRoom = splitInput[1];
    //If the player types a movement command or take, drop, or examine command, call the corresponding function
    if (playerActions.enter.includes(command)) {
      moveTo(itemOrRoom);
    } 
    else if (playerActions.examine.includes(command)) {
      examineItem(itemOrRoom);
    }
    else if (playerActions.take.includes(command)) {
      takeItem(itemOrRoom);
    }else if (playerActions.drop.includes(command)) {
      dropItem(itemOrRoom);
    }
    //If the user types 'inventory' display current player inventory
    else if (sanitizedInput === "inventory") {
      console.log(player.currInventory);
    }
    //If the user types status, display the current room and player inventory
    else if (sanitizedInput === "status") {
      console.log(`\nYou are in${player.currLocation.name === "mainStreet" ? "" : " the"} ${player.currLocation.name}.\nCurrent Player Inventory:\n${player.currInventory}`);
    }
    //If the command is invalid, display error message
    else {
      console.log(`Sorry I don't understand '${sanitizedInput}'. Please try again with a valid command.`);
    }
  }
  process.exit();
}