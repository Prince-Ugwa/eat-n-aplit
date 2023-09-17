import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

export default function App() {
  //LIFTING STATE to   make display in ui possible
  const [friends, setFriends] = useState(initialFriends);
  ////////////////////////////
  const [showFriend, setshowFriend] = useState(false);

  //selecting friend to share bill with
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleShowFriend() {
    setshowFriend((friend) => !friend);
  }

  function handleAddfriend(friend) {
    setFriends((friends) => [...friends, friend]);
    setshowFriend(false);
  }

  function handleSelectFriend(friend) {
    // setSelectedFriend(friend);
    setSelectedFriend((curFriend) =>
      curFriend?.id === friend?.id ? null : friend
    );
    setshowFriend(false);
  }

  //this function update the balance of each friends either the theere is a debt or the user and frien are even
  function handleSplitBill(value) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
  }
  return (
    <div className="app">
      <div className="sidebar">
        <FriendList
          friends={friends}
          onSelection={handleSelectFriend}
          selectedFriend={selectedFriend}
        />

        {showFriend && <AddFriendForm onAddFriend={handleAddfriend} />}
        <Button onClick={handleShowFriend}>
          {" "}
          {showFriend ? "close" : "Add friend"}
        </Button>
      </div>
      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          onSplitBill={handleSplitBill}
        />
      )}
    </div>
  );
}

function FriendList({ friends, onSelection, selectedFriend }) {
  // const friends = initialFriends;
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          onSelection={onSelection}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelection, selectedFriend }) {
  //comparing the selected friend to the friend object
  const isSelected = selectedFriend?.id === friend.id;
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          you owe {friend.name} {friend.balance}$
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you {friend.balance}$
        </p>
      )}
      {friend.balance === 0 && <p>you and {friend.name} are even</p>}

      <Button onClick={() => onSelection(friend)}>
        {isSelected ? "close" : "select"}
      </Button>
    </li>
  );
}

function AddFriendForm({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handleSubmit(e) {
    e.preventDefault();

    if (!name || !image) {
      return alert("Input name and image URL correctly");
    }

    const id = crypto.randomUUID();

    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };
    onAddFriend(newFriend);
    setName("");
    setImage("https://i.pravatar.cc/48");
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>👯‍♂️Friend Name </label>
      <input
        type="text"
        placeholder="enter friend name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label> 🎴Image URL </label>
      <input
        type="text"
        placeholder="enter image url"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />

      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ selectedFriend, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [expenseValue, setExpenseValue] = useState("");
  const paidByFriend = bill ? bill - expenseValue : "";
  const [whoIsPaying, setWhoIsPaying] = useState("user");

  function handleSubmit(e) {
    e.preventDefault();
    if (!bill || !expenseValue) return;
    onSplitBill(whoIsPaying === "user" ? paidByFriend : -expenseValue);
    setBill("");
    setExpenseValue("");
  }
  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {selectedFriend.name}</h2>
      <label>💰 Bill value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(+e.target.value)}
      />

      <label>🎋Your expense</label>
      <input
        type="text"
        value={expenseValue}
        onChange={(e) =>
          setExpenseValue(
            +e.target.value > bill ? expenseValue : +e.target.value //making sure that expense value is not greater than the bill
          )
        }
      />
      <label> 👩🏼‍🤝‍🧑🏻{selectedFriend.name} expense</label>
      <input type="text" disabled value={paidByFriend} />

      <label> 🤑Who is paying the bill</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>
      <Button>Split bill</Button>
    </form>
  );
}
